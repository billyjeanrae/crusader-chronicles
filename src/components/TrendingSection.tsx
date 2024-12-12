import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react";

const TrendingSection = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(email)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(4);

    setTrending(data || []);
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Flame className="w-6 h-6 text-secondary" />
          <h2 className="text-2xl font-serif font-bold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((post, index) => (
            <article 
              key={post.id}
              className="cursor-pointer group"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <span className="text-4xl font-serif font-bold text-gray-200">
                0{index + 1}
              </span>
              <h3 className="text-lg font-serif font-bold mt-2 group-hover:text-secondary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                By {post.author?.email}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;