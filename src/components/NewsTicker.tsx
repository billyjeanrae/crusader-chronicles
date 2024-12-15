import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBreakingNews();
  }, []);

  const fetchBreakingNews = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title')
      .eq('is_breaking_news', true)
      .eq('status', 'published')
      .not('is_hidden', 'eq', true)
      .not('is_archived', 'eq', true);
    
    if (error) {
      console.error('Error fetching breaking news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch breaking news",
        variant: "destructive"
      });
      return;
    }

    setNews(data || []);
  };

  if (news.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary text-white py-3 overflow-hidden relative border-y border-secondary-foreground/20">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-secondary to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-secondary to-transparent z-10" />
      <div className="flex items-center gap-2 px-4 absolute left-0 top-1/2 -translate-y-1/2 z-20">
        <AlertCircle className="h-4 w-4 text-red-400 animate-pulse" />
        <span className="font-semibold">BREAKING</span>
      </div>
      <div className="news-ticker whitespace-nowrap pl-32">
        {news.map((item) => (
          <Link 
            key={item.id} 
            to={`/post/${item.id}`}
            className="mx-8 hover:text-secondary-foreground/80 transition-colors inline-block"
          >
            {item.title} •
          </Link>
        ))}
        {/* Duplicate the news items to create a seamless loop */}
        {news.map((item) => (
          <Link 
            key={`${item.id}-duplicate`} 
            to={`/post/${item.id}`}
            className="mx-8 hover:text-secondary-foreground/80 transition-colors inline-block"
          >
            {item.title} •
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;