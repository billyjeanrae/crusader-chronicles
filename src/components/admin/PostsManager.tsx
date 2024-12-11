import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ 
    title: "", 
    content: "", 
    excerpt: "",
    featured_image: null as File | null
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost({ ...newPost, featured_image: e.target.files[0] });
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let imagePath = null;
    if (newPost.featured_image) {
      const fileExt = newPost.featured_image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, newPost.featured_image);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
        return;
      }
      imagePath = fileName;
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          ...newPost,
          author_id: session.user.id,
          status: 'draft',
          featured_image: imagePath
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
    setNewPost({ title: "", content: "", excerpt: "", featured_image: null });
    fetchPosts();
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Post deleted successfully"
    });
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
        <div>
          <Label htmlFor="image">Featured Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <Button type="submit">Create Post</Button>
      </form>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="p-4 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">By {post.author?.email}</p>
                <p className="text-sm text-gray-600">Status: {post.status}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeletePost(post.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};