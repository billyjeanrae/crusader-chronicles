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

    setNewsItems(data?.map(item => item.title) || []);
  };

  const handleSaveNews = async () => {
    if (!newItem.trim()) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to manage breaking news",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: newItem,
        content: newItem, // Required field
        author_id: session.session.user.id,
        is_breaking_news: true,
        status: 'published'
      });

    if (error) {
      console.error('Error saving news:', error);
      toast({
        title: "Error",
        description: "Failed to add news item",
        variant: "destructive"
      });
      return;
    }

    await fetchNews(); // Refresh the list
    setNewItem("");
    setEditingIndex(null);
    toast({
      title: "Success",
      description: "News item added successfully"
    });
  };

  const handleEdit = async (index: number) => {
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .eq('is_breaking_news', true)
      .eq('status', 'published')
      .not('is_hidden', 'eq', true)
      .not('is_archived', 'eq', true);
    
    if (error || !data) {
      toast({
        title: "Error",
        description: "Failed to fetch post for editing",
        variant: "destructive"
      });
      return;
    }

    setNewItem(newsItems[index]);
    setEditingIndex(index);
  };

  const handleRemoveNews = async (index: number) => {
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .eq('is_breaking_news', true)
      .eq('status', 'published')
      .not('is_hidden', 'eq', true)
      .not('is_archived', 'eq', true);
    
    if (error || !data || !data[index]) {
      toast({
        title: "Error",
        description: "Failed to find post for removal",
        variant: "destructive"
      });
      return;
    }

    const { error: updateError } = await supabase
      .from('posts')
      .update({ is_breaking_news: false })
      .eq('id', data[index].id);

    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to remove news item",
        variant: "destructive"
      });
      return;
    }

    await fetchNews(); // Refresh the list
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