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
      .eq('status', 'published');
    
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
    <div className="bg-primary text-white py-2 overflow-hidden">
      <div className="news-ticker whitespace-nowrap">
        {news.map((item) => (
          <Link 
            key={item.id} 
            to={`/post/${item.id}`}
            className="mx-8 hover:text-primary-foreground/80 transition-colors inline-block"
          >
            {item.title} •
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;