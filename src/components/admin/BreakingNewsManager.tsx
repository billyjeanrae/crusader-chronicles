import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BreakingNewsManager = () => {
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
      toast({
        title: "Error",
        description: "Failed to fetch news items",
        variant: "destructive"
      });
      return;
    }

    if (data) {
      try {
        const items = JSON.parse(data.content);
        setNewsItems(items);
      } catch (e) {
        console.error('Error parsing news:', e);
        setNewsItems([]);
      }
    } else {
      setNewsItems([]);
    }
  };

  const handleSaveNews = async () => {
    if (!newItem.trim()) return;
    
    const updatedNews = editingIndex !== null
      ? newsItems.map((item, index) => index === editingIndex ? newItem : item)
      : [...newsItems, newItem];

    const { error } = await supabase
      .from('pages')
      .upsert({
        slug: 'breaking-news',
        title: 'Breaking News',
        content: JSON.stringify(updatedNews),
        is_published: true,
        author_id: (await supabase.auth.getSession()).data.session?.user.id
      });

    if (error) {
      toast({
        title: "Error",
        description: editingIndex !== null ? "Failed to update news item" : "Failed to add news item",
        variant: "destructive"
      });
      return;
    }

    setNewsItems(updatedNews);
    setNewItem("");
    setEditingIndex(null);
    toast({
      title: "Success",
      description: editingIndex !== null ? "News item updated successfully" : "News item added successfully"
    });
  };

  const handleEdit = (index: number) => {
    setNewItem(newsItems[index]);
    setEditingIndex(index);
  };

  const handleRemoveNews = async (index: number) => {
    const updatedNews = newsItems.filter((_, i) => i !== index);
    
    const { error } = await supabase
      .from('pages')
      .upsert({
        slug: 'breaking-news',
        title: 'Breaking News',
        content: JSON.stringify(updatedNews),
        is_published: true,
        author_id: (await supabase.auth.getSession()).data.session?.user.id
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove news item",
        variant: "destructive"
      });
      return;
    }

    setNewsItems(updatedNews);
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewItem("");
    }
    toast({
      title: "Success",
      description: "News item removed successfully"
    });
  };

  const handleCancel = () => {
    setNewItem("");
    setEditingIndex(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Breaking News</h2>
      
      <div className="flex gap-4 mb-6">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter news item..."
          className="flex-1"
        />
        <Button onClick={handleSaveNews}>
          {editingIndex !== null ? 'Update News' : 'Add News'}
        </Button>
        {editingIndex !== null && (
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {newsItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-background border rounded">
            <span>{item}</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(index)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveNews(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};