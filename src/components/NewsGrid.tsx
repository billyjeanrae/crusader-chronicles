import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NewsGrid = () => {
  const [posts, setPosts] = useState([]);
  const { toast } = useToast();

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

  return (
    <div className="container mx-auto px-4 py-12">
      <h3 className="text-2xl font-serif font-bold mb-8">Latest Stories</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post: any, index) => (
          <article key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
              {post.featured_image && (
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="text-secondary text-sm font-semibold">
              By {post.author?.email}
            </span>
            <h4 className="text-xl font-serif font-bold mt-2 mb-2">
              {post.title}
            </h4>
            <p className="text-accent">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;