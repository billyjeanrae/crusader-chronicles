import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CategoryHighlights = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*');
    
    setCategories(data || []);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-serif font-bold mb-8">Category Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="relative h-64 group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => navigate(`/${category.name.toLowerCase()}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
              <img
                src={`https://source.unsplash.com/random/800x600?${category.name}`}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-200 text-sm">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;