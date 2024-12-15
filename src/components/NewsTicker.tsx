import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
    <div className="bg-secondary text-white py-2 overflow-hidden relative">
      <div className="news-ticker whitespace-nowrap">
        {news.map((item) => (
          <Link 
            key={item.id} 
            to={`/post/${item.id}`}
            className="mx-8 hover:text-secondary-foreground/80 transition-colors inline-block"
          >
            BREAKING NEWS: {item.title} •
          </Link>
        ))}
        {/* Duplicate the news items to create a seamless loop */}
        {news.map((item) => (
          <Link 
            key={`${item.id}-duplicate`} 
            to={`/post/${item.id}`}
            className="mx-8 hover:text-secondary-foreground/80 transition-colors inline-block"
          >
            BREAKING NEWS: {item.title} •
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;