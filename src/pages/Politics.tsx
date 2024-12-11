import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  author: {
    email: string;
  };
  categories: {
    category: {
      id: string;
      name: string;
    };
  }[];
}

const Politics = () => {
  const navigate = useNavigate();
  
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['politics-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(email),
          categories!inner(category:categories(*))
        `)
        .eq('categories.name', 'Politics')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Politics</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <article 
                key={post.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="h-48 bg-gray-200 mb-4">
                  {post.featured_image && (
                    <img
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-serif font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="text-sm text-gray-500">
                    By {post.author.email} • {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </div>
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

export default Politics;