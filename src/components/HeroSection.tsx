import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      .limit(5);

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

  const placeholderImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';

  return (
    <section className="relative bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Carousel className="relative h-[500px]">
          <CarouselContent>
            {headlines.map((headline) => (
              <CarouselItem key={headline.id}>
                <div 
                  className="relative h-[500px] cursor-pointer group"
                  onClick={() => navigate(`/post/${headline.id}`)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-black/60">
                    <img
                      src={getImageUrl(headline.featured_image) || placeholderImage}
                      alt={headline.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-8">
                    <div className="max-w-3xl">
                      <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 group-hover:text-secondary transition-colors">
                        {headline.title}
                      </h2>
                      <p className="text-lg mb-4 text-gray-200">
                        {headline.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-300">
                        <span>By {headline.author?.email}</span>
                        <span className="mx-2">•</span>
                        <time dateTime={headline.published_at || headline.created_at}>
                          {new Date(headline.published_at || headline.created_at).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2" />
          <CarouselNext className="absolute right-4 top-1/2" />
        </Carousel>
      </div>
    </section>
  );
};

export default HeroSection;