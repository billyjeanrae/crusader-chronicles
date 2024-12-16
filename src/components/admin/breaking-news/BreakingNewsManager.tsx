import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewsItemForm } from "./NewsItemForm";
import { NewsItemList } from "./NewsItemList";

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

    const { error } = await supabase
      .from('posts')
      .insert({
        title: newItem,
        content: newItem,
        author_id: session.session.user.id,
        is_breaking_news: true,
        status: 'published'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add news item",
        variant: "destructive"
      });
      return;
    }

    await fetchNews();
    setNewItem("");
    setEditingIndex(null);
    toast({
      title: "Success",
      description: "News item added successfully"
    });
  };

  const handleEdit = async (index: number) => {
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

    await fetchNews();
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewItem("");
    }
    toast({
      title: "Success",
      description: "News item removed successfully"
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Breaking News</h2>
      <NewsItemForm
        newItem={newItem}
        onItemChange={setNewItem}
        onSave={handleSaveNews}
        onCancel={() => {
          setNewItem("");
          setEditingIndex(null);
        }}
        isEditing={editingIndex !== null}
      />
      <NewsItemList
        items={newsItems}
        onEdit={handleEdit}
        onRemove={handleRemoveNews}
      />
    </div>
  );
};