import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const HomepageManager = () => {
  const [sections, setSections] = useState([]);
  const [posts, setPosts] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
    fetchPosts();
    fetchFeaturedStory();
  }, []);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sections",
        variant: "destructive"
      });
      return;
    }

    setSections(data || []);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
      return;
    }

    setPosts(data || []);
  };

  const fetchFeaturedStory = async () => {
    const { data, error } = await supabase
      .from('featured_stories')
      .select('*, posts(*)')
      .eq('position', 'hero')
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to fetch featured story",
        variant: "destructive"
      });
      return;
    }

    setFeaturedStory(data?.posts?.id || null);
  };

  const handleSectionToggle = async (sectionId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('homepage_sections')
      .update({ is_active: isActive })
      .eq('id', sectionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update section visibility",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Section visibility updated"
    });
    fetchSections();
  };

  const handleFeaturedStoryChange = async (postId: string) => {
    const { error: deleteError } = await supabase
      .from('featured_stories')
      .delete()
      .eq('position', 'hero');

    if (deleteError) {
      toast({
        title: "Error",
        description: "Failed to update featured story",
        variant: "destructive"
      });
      return;
    }

    if (postId) {
      const { error: insertError } = await supabase
        .from('featured_stories')
        .insert([
          { post_id: postId, position: 'hero' }
        ]);

      if (insertError) {
        toast({
          title: "Error",
          description: "Failed to set new featured story",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Featured story updated"
    });
    setFeaturedStory(postId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Story</h2>
        <Select value={featuredStory || ''} onValueChange={handleFeaturedStoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a post as featured story" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {posts.map((post: any) => (
              <SelectItem key={post.id} value={post.id}>
                {post.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Section Visibility</h2>
        <div className="space-y-4">
          {sections.map((section: any) => (
            <div key={section.id} className="flex items-center justify-between">
              <Label htmlFor={section.id} className="capitalize">
                {section.name.replace('_', ' ')}
              </Label>
              <Switch
                id={section.id}
                checked={section.is_active}
                onCheckedChange={(checked) => handleSectionToggle(section.id, checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};