import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./ui/card";

const NewsGrid = () => {
  const [posts, setPosts] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(email)
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

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h3 className="text-2xl font-serif font-bold mb-8">Latest Stories</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post: any, index) => (
          <Card 
            key={post.id} 
            className="animate-fade-in cursor-pointer group hover:shadow-lg transition-all duration-200" 
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => handlePostClick(post.id)}
          >
            <CardHeader className="p-0">
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <span className="text-secondary text-sm font-semibold">
                By {post.author?.email}
              </span>
              <h4 className="text-xl font-serif font-bold mt-2 mb-2 group-hover:text-secondary transition-colors">
                {post.title}
              </h4>
              <p className="text-accent line-clamp-3">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;