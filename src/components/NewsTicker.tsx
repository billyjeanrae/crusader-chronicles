import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('content')
      .eq('slug', 'breaking-news')
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching news:', error);
      return;
    }

    if (data) {
      try {
        const newsItems = JSON.parse(data.content);
        setNews(newsItems);
      } catch (e) {
        console.error('Error parsing news:', e);
        setNews([]);
      }
    } else {
      setNews([]);
    }
  };

  if (news.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary text-white py-2 overflow-hidden">
      <div className="news-ticker whitespace-nowrap">
        {news.map((item, index) => (
          <span key={index} className="mx-8">
            {item} •
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;