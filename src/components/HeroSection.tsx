import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % headlines.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + headlines.length) % headlines.length);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [headlines.length]);

  if (!headlines.length) return null;

  const currentHeadline = headlines[currentIndex];
  const placeholderImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';

  return (
    <section className="relative bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="relative h-[500px] group cursor-pointer" onClick={() => navigate(`/post/${currentHeadline.id}`)}>
          {/* Background Image */}
          <div className="absolute inset-0 bg-black/60">
            <img
              src={getImageUrl(currentHeadline.featured_image) || placeholderImage}
              alt={currentHeadline.title}
              className="w-full h-full object-cover opacity-50"
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-8">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 group-hover:text-secondary transition-colors">
                {currentHeadline.title}
              </h2>
              <p className="text-lg mb-4 text-gray-200">
                {currentHeadline.excerpt}
              </p>
              <div className="flex items-center text-sm text-gray-300">
                <span>By {currentHeadline.author?.email}</span>
                <span className="mx-2">•</span>
                <time dateTime={currentHeadline.published_at || currentHeadline.created_at}>
                  {new Date(currentHeadline.published_at || currentHeadline.created_at).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {headlines.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-gray-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;