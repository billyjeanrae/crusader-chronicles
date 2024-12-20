import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TickerContent } from "./TickerContent";

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [mode, setMode] = useState<'black' | 'red'>('red');
  const { toast } = useToast();

  useEffect(() => {
    fetchBreakingNews();
    // Switch modes every 30 seconds
    const interval = setInterval(() => {
      setMode(prev => prev === 'black' ? 'red' : 'black');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchBreakingNews = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title')
        .eq('is_breaking_news', true)
        .eq('status', 'published')
        .eq('is_hidden', false)
        .eq('is_archived', false);
      
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
    } catch (error) {
      console.error('Error in fetchBreakingNews:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching breaking news",
        variant: "destructive"
      });
    }
  };

  if (news.length === 0) {
    return null;
  }

  return (
    <div 
      className={`py-3 overflow-hidden relative border-y ${
        mode === 'black' 
          ? 'bg-black text-white border-gray-800' 
          : 'bg-secondary text-white border-secondary-foreground/20'
      }`}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r z-10" 
        style={{ 
          background: mode === 'black' 
            ? 'linear-gradient(to right, black, transparent)' 
            : 'linear-gradient(to right, var(--secondary), transparent)' 
        }} 
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l z-10"
        style={{ 
          background: mode === 'black' 
            ? 'linear-gradient(to left, black, transparent)' 
            : 'linear-gradient(to left, var(--secondary), transparent)' 
        }} 
      />
      <TickerContent news={news} mode={mode} />
    </div>
  );
};

export default NewsTicker;