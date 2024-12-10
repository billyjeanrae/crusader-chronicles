import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", excerpt: "" });
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, author:profiles(email)');
    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }
    setPosts(data || []);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          ...newPost,
          author_id: session.user.id,
          status: 'draft'
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Post created successfully"
    });
    setNewPost({ title: "", content: "", excerpt: "" });
    fetchPosts();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Posts</h2>
      
      <form onSubmit={handleCreatePost} className="mb-8 space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            value={newPost.excerpt}
            onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
            className="min-h-[200px]"
          />
        </div>
        <Button type="submit">Create Post</Button>
      </form>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="p-4 border rounded">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-600">By {post.author?.email}</p>
            <p className="text-sm text-gray-600">Status: {post.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};