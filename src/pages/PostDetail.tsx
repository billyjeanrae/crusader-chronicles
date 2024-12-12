import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    categories: {
      id: string;
      name: string;
    };
  }[];
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(email),
          categories:posts_categories(
            categories(*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch post details",
          variant: "destructive"
        });
        throw error;
      }
      if (!data) throw new Error('Post not found');
      
      return data as Post;
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
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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

  const placeholderImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {post && (
          <>
            {/* Hero Image */}
            <div className="w-full h-[500px] relative">
              <img
                src={getImageUrl(post.featured_image) || placeholderImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Article Content */}
            <article className="container mx-auto px-4 py-8">
              <Button
                variant="ghost"
                className="mb-8"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{post.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                  <span>By {post.author?.email}</span>
                  <span>•</span>
                  <time dateTime={post.published_at || post.created_at}>
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </time>
                </div>
                
                <div 
                  className="prose max-w-none mb-8" 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
                
                <div className="flex flex-wrap gap-2">
                  {post.categories?.map((category) => (
                    <span 
                      key={category.categories.id}
                      className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                    >
                      {category.categories.name}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;