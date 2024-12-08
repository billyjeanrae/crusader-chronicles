import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Nation = () => {
  const navigate = useNavigate();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['nation-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(email),
          categories!inner(*)
        `)
        .eq('categories.name', 'Nation')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Nation</h1>
        
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <article 
                key={post.id} 
                className="cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4">
                  {/* Image placeholder */}
                </div>
                <h2 className="text-xl font-serif font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="text-sm text-gray-500">
                  By {post.author.email} • {new Date(post.published_at).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Nation;