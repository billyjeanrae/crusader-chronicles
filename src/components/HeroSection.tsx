import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  const { data: featuredPost } = useQuery({
    queryKey: ['featuredPost'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          author:profiles(email)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const handleReadMore = () => {
    if (featuredPost?.id) {
      navigate(`/post/${featuredPost.id}`);
    }
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="animate-fade-in">
          <span className="text-secondary font-semibold">Featured</span>
          <h2 className="text-4xl font-serif font-bold mt-2 mb-4 text-primary">
            {featuredPost?.title || "Loading..."}
          </h2>
          <p className="text-accent text-lg mb-6">
            {featuredPost?.excerpt || "Loading excerpt..."}
          </p>
          <Button 
            onClick={handleReadMore}
            className="bg-secondary text-white hover:bg-opacity-90 transition-colors"
          >
            Read More
          </Button>
        </div>
        <div className="h-[400px] rounded-lg overflow-hidden">
          {featuredPost?.featured_image ? (
            <img
              src={getImageUrl(featuredPost.featured_image)}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;