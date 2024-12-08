import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const PostDetail = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
      console.log('Fetching post with ID:', id); // Debug log
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(email),
          categories:posts_categories(
            category:categories(*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching post:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No post found with ID:', id);
        throw new Error('Post not found');
      }
      
      console.log('Fetched post:', data); // Debug log
      return data;
    },
    enabled: typeof id === 'string' && id.length > 0,
  });

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load post'}
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : post ? (
          <article className="max-w-3xl mx-auto">
            <div className="h-64 bg-gray-200 rounded-lg mb-8">
              {/* Image placeholder */}
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-8">
              By {post.author?.email} • {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
            </div>
            <div className="prose max-w-none">
              {post.content}
            </div>
            <div className="mt-8">
              {post.categories?.map((category) => (
                <span 
                  key={category.category.id}
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {category.category.name}
                </span>
              ))}
            </div>
          </article>
        ) : (
          <Alert>
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>
              The requested post could not be found.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;