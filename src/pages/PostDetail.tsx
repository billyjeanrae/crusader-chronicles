import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
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
      
      if (error) throw error;
      if (!data) throw new Error('Post not found');
      
      return data;
    },
    enabled: !!id
  });

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
        {post ? (
          <article className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              className="mb-8"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {post.featured_image && (
              <div className="relative h-[500px] rounded-lg overflow-hidden mb-8 shadow-lg">
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-4xl font-serif font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>By {post.author?.email}</span>
              <span>•</span>
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="flex flex-wrap gap-2">
              {post.categories?.map((category) => (
                <span 
                  key={category.category.id}
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
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