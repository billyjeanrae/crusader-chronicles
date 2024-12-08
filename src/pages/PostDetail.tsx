import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(email),
          categories(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : post ? (
          <article className="max-w-3xl mx-auto">
            <div className="h-64 bg-gray-200 rounded-lg mb-8">
              {/* Image placeholder */}
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-8">
              By {post.author.email} • {new Date(post.published_at).toLocaleDateString()}
            </div>
            <div className="prose max-w-none">
              {post.content}
            </div>
          </article>
        ) : (
          <div>Post not found</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;