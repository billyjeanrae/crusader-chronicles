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

  const placeholderImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h3 className="text-2xl font-serif font-bold mb-8">Latest Stories</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post: any, index) => (
          <article 
            key={post.id} 
            className="animate-fade-in cursor-pointer group" 
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <img
                src={getImageUrl(post.featured_image) || placeholderImages[index % placeholderImages.length]}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className="text-secondary text-sm font-semibold">
              By {post.author?.email}
            </span>
            <h4 className="text-xl font-serif font-bold mt-2 mb-2 group-hover:text-secondary transition-colors">
              {post.title}
            </h4>
            <p className="text-accent line-clamp-3">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;