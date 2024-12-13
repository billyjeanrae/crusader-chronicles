import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const NewsGrid = () => {
  const [posts, setPosts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    checkSectionVisibility();
  }, []);

  const checkSectionVisibility = async () => {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('is_active')
      .eq('name', 'latest_stories')
      .single();

    if (error) {
      console.error('Error checking section visibility:', error);
      return;
    }

    setIsVisible(data?.is_active ?? true);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(email),
        categories:posts_categories(category:categories(*))
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
      return;
    }

    setPosts(data || []);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  if (!isVisible) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h3 className="text-2xl font-serif font-bold mb-8">Latest Stories</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post: any, index) => (
          <Card 
            key={post.id} 
            className="animate-fade-in cursor-pointer group hover:shadow-lg transition-shadow duration-200" 
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <CardContent className="p-4">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                  src={getImageUrl(post.featured_image) || `https://images.unsplash.com/photo-${index + 1}?auto=format&fit=crop&w=800&h=400`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              {post.categories?.[0]?.category && (
                <span className="text-secondary text-sm font-semibold">
                  {post.categories[0].category.name}
                </span>
              )}
              <h4 className="text-xl font-serif font-bold mt-2 mb-2 group-hover:text-secondary transition-colors">
                {post.title}
              </h4>
              <p className="text-accent line-clamp-3">{post.excerpt}</p>
              <span className="text-sm text-gray-600 mt-2 block">
                By {post.author?.email}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;