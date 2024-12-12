import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

const EditorsPicks = () => {
  const [picks, setPicks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPicks();
  }, []);

  const fetchPicks = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(email)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);

    setPicks(data || []);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return `${supabase.storage.from('post-images').getPublicUrl(imagePath).data.publicUrl}`;
  };

  return (
    <section className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Star className="w-6 h-6 text-secondary" />
          <h2 className="text-2xl font-serif font-bold">Editor's Picks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {picks.map((post) => (
            <article 
              key={post.id}
              className="cursor-pointer group"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className="h-48 mb-4 overflow-hidden rounded">
                <img
                  src={getImageUrl(post.featured_image) || `https://source.unsplash.com/random/800x600?article`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-serif font-bold group-hover:text-secondary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                By {post.author?.email}
              </p>
              <p className="text-gray-400 mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorsPicks;