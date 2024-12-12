import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [headlines, setHeadlines] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(email)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch headlines",
        variant: "destructive"
      });
      return;
    }

    setHeadlines(data || []);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  if (!headlines.length) return null;

  const mainHeadline = headlines[0];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-red-600 font-semibold mb-2 inline-block">Featured</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 hover:text-red-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/post/${mainHeadline.id}`)}>
              {mainHeadline.title}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {mainHeadline.excerpt}
            </p>
            <Button 
              onClick={() => navigate(`/post/${mainHeadline.id}`)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Read More
            </Button>
          </div>
          <div className="relative h-[400px] bg-gray-100">
            <img
              src={getImageUrl(mainHeadline.featured_image) || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167'}
              alt={mainHeadline.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;