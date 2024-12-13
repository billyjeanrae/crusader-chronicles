import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [featuredStory, setFeaturedStory] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedStory();
    checkSectionVisibility();
  }, []);

  const checkSectionVisibility = async () => {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('is_active')
      .eq('name', 'hero')
      .single();

    if (error) {
      console.error('Error checking section visibility:', error);
      return;
    }

    setIsVisible(data?.is_active ?? true);
  };

  const fetchFeaturedStory = async () => {
    const { data, error } = await supabase
      .from('featured_stories')
      .select(`
        post_id,
        posts (
          id,
          title,
          excerpt,
          featured_image,
          author_id,
          profiles:author_id (email)
        )
      `)
      .eq('position', 'hero')
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch featured story",
        variant: "destructive"
      });
      return;
    }

    if (data?.posts) {
      setFeaturedStory(data.posts);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&h=800';
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  if (!isVisible || !featuredStory) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={() => navigate(`/post/${featuredStory.id}`)}
      >
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8">
              <span className="text-secondary font-semibold">Featured</span>
              <h2 className="text-4xl font-serif font-bold mt-2 mb-4 text-primary">
                {featuredStory.title}
              </h2>
              <p className="text-accent text-lg mb-6">
                {featuredStory.excerpt}
              </p>
              <span className="text-sm text-gray-600">
                By {featuredStory.profiles?.email}
              </span>
            </div>
            <div className="h-[400px] relative">
              <img
                src={getImageUrl(featuredStory.featured_image)}
                alt={featuredStory.title}
                className="w-full h-full object-cover rounded-r-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSection;