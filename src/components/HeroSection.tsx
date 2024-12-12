import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const mainHeadline = headlines[0];
  const secondaryHeadlines = headlines.slice(1, 5);

  const placeholderImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
  ];

  return (
    <section className="relative bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Headline */}
          <div 
            className="relative h-[500px] cursor-pointer group"
            onClick={() => navigate(`/post/${mainHeadline.id}`)}
          >
            <div className="absolute inset-0 bg-black/60">
              <img
                src={getImageUrl(mainHeadline.featured_image) || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167'}
                alt={mainHeadline.title}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            <div className="relative h-full flex flex-col justify-end p-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 group-hover:text-secondary transition-colors">
                  {mainHeadline.title}
                </h2>
                <p className="text-lg mb-4 text-gray-200">
                  {mainHeadline.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-300">
                  <span>By {mainHeadline.author?.email}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={mainHeadline.published_at || mainHeadline.created_at}>
                    {new Date(mainHeadline.published_at || mainHeadline.created_at).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Headlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryHeadlines.map((headline, index) => (
              <div 
                key={headline.id}
                className="relative h-[240px] cursor-pointer group"
                onClick={() => navigate(`/post/${headline.id}`)}
              >
                <div className="absolute inset-0 bg-black/60">
                  <img
                    src={getImageUrl(headline.featured_image) || placeholderImages[index]}
                    alt={headline.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                </div>
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-secondary transition-colors">
                    {headline.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-300">
                    <span>By {headline.author?.email}</span>
                    <span className="mx-2">•</span>
                    <time dateTime={headline.published_at || headline.created_at}>
                      {new Date(headline.published_at || headline.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;