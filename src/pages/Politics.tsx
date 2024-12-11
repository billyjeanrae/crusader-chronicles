import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  author_id: string;
  status: string | null;
  updated_at: string;
  author: {
    email: string;
  };
  categories: {
    name: string;
    id: string;
  }[];
}

const Politics = () => {
  const navigate = useNavigate();
  
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['politics-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(email),
          categories:posts_categories(categories(*))
        `)
        .eq('categories.name', 'Politics')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching posts",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // Transform the data to match our Post interface
      const transformedData = data.map(post => ({
        ...post,
        categories: post.categories.map((cat: any) => ({
          id: cat.categories.id,
          name: cat.categories.name
        }))
      }));
      
      return transformedData;
    },
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-2">Politics</h1>
          <p className="text-gray-600 mb-8">Latest political news and analysis</p>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load posts. Please try again later.</p>
            </div>
          ) : !posts?.length ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No political news articles available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <div className="relative h-48 bg-gray-200">
                    {post.featured_image ? (
                      <img
                        src={getImageUrl(post.featured_image)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.map(category => (
                        <span 
                          key={category.id}
                          className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-serif font-bold mb-2 group-hover:text-secondary transition-colors">
                      {post.title}
                      <ArrowUpRight className="inline-block ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {post.author.email}</span>
                      <time dateTime={post.published_at || post.created_at}>
                        {new Date(post.published_at || post.created_at).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Politics;