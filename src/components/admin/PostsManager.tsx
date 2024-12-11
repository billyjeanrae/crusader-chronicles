import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Editor } from "@tinymce/tinymce-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newPost, setNewPost] = useState({ 
    title: "", 
    content: "", 
    excerpt: "",
    featured_image: null as File | null,
    category_id: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }
    setCategories(data || []);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(email),
        categories:posts_categories(category:categories(*))
      `);
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

    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt,
          author_id: session.user.id,
          status: 'draft',
          featured_image: imagePath
        }
      ])
      .select()
      .single();

    if (postError) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return;
    }

    if (newPost.category_id && post) {
      const { error: categoryError } = await supabase
        .from('posts_categories')
        .insert([
          {
            post_id: post.id,
            category_id: newPost.category_id
          }
        ]);

      if (categoryError) {
        toast({
          title: "Warning",
          description: "Post created but failed to assign category",
          variant: "destructive"
        });
      }
    }

    toast({
      title: "Success",
      description: "Post created successfully"
    });
    setNewPost({ 
      title: "", 
      content: "", 
      excerpt: "", 
      featured_image: null,
      category_id: ""
    });
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
          <Label htmlFor="category">Category</Label>
          <Select
            value={newPost.category_id}
            onValueChange={(value) => setNewPost({ ...newPost, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Editor
            apiKey="your-tinymce-api-key"
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help'
            }}
            value={newPost.content}
            onEditorChange={(content) => setNewPost({ ...newPost, content })}
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
                <p className="text-sm text-gray-600">
                  Categories: {post.categories?.map((c: any) => c.category.name).join(', ')}
                </p>
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