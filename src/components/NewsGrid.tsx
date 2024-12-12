import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
        author:profiles(email),
        categories:posts_categories(category:categories(*))
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);

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

  const placeholderImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475'
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-serif font-bold mb-8">Latest Stories</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post: any, index) => (
          <article 
            key={post.id} 
            className="cursor-pointer group" 
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <div className="h-48 bg-gray-200 mb-4 overflow-hidden">
              <img
                src={getImageUrl(post.featured_image) || placeholderImages[index]}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mb-2">
              {post.categories?.[0]?.category?.name && (
                <span className="text-red-600 text-sm font-semibold">
                  {post.categories[0].category.name}
                </span>
              )}
            </div>
            <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-red-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;