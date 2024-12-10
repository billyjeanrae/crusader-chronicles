import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const PagesManager = () => {
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    is_published: false,
    show_in_menu: false,
    menu_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('menu_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching pages:', error);
      return;
    }
    setPages(data || []);
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('pages')
      .insert([{
        ...newPage,
        author_id: session.user.id
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Page created successfully"
    });
    setNewPage({
      title: "",
      slug: "",
      content: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      is_published: false,
      show_in_menu: false,
      menu_order: 0
    });
    fetchPages();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Pages</h2>
      
      <form onSubmit={handleCreatePage} className="mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={newPage.slug}
              onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={newPage.content}
            onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
            required
            className="min-h-[200px]"
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={newPage.meta_title}
                onChange={(e) => setNewPage({ ...newPage, meta_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={newPage.meta_description}
                onChange={(e) => setNewPage({ ...newPage, meta_description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={newPage.meta_keywords}
                onChange={(e) => setNewPage({ ...newPage, meta_keywords: e.target.value })}
                placeholder="Separate keywords with commas"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Navigation Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show_in_menu"
                checked={newPage.show_in_menu}
                onCheckedChange={(checked) => setNewPage({ ...newPage, show_in_menu: checked })}
              />
              <Label htmlFor="show_in_menu">Show in Menu</Label>
            </div>
            {newPage.show_in_menu && (
              <div>
                <Label htmlFor="menu_order">Menu Order</Label>
                <Input
                  id="menu_order"
                  type="number"
                  value={newPage.menu_order}
                  onChange={(e) => setNewPage({ ...newPage, menu_order: parseInt(e.target.value) })}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={newPage.is_published}
                onCheckedChange={(checked) => setNewPage({ ...newPage, is_published: checked })}
              />
              <Label htmlFor="is_published">Publish Page</Label>
            </div>
          </div>
        </div>

        <Button type="submit">Create Page</Button>
      </form>

      <div className="space-y-4">
        {pages.map((page: any) => (
          <div key={page.id} className="p-4 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{page.title}</h3>
                <p className="text-sm text-gray-600">Slug: {page.slug}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Menu Order: {page.menu_order}</p>
                <p>{page.is_published ? "Published" : "Draft"}</p>
                <p>{page.show_in_menu ? "Shown in Menu" : "Hidden from Menu"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};