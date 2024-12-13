import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "./posts/PostForm";
import { PostList } from "./posts/PostList";

export const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleSubmit = async (formData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let imagePath = formData.featured_image ? formData.featured_image : null;

    if (formData.featured_image instanceof File) {
      const fileExt = formData.featured_image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, formData.featured_image);

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

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      status: formData.status,
      featured_image: imagePath,
      author_id: session.user.id
    };

    if (editingPost) {
      const { error: updateError } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', editingPost.id);

      if (updateError) {
        toast({
          title: "Error",
          description: "Failed to update post",
          variant: "destructive"
        });
        return;
      }

      if (formData.category_id) {
        await supabase
          .from('posts_categories')
          .delete()
          .eq('post_id', editingPost.id);

        await supabase
          .from('posts_categories')
          .insert([
            {
              post_id: editingPost.id,
              category_id: formData.category_id
            }
          ]);
      }

      toast({
        title: "Success",
        description: "Post updated successfully"
      });
      setEditingPost(null);
    } else {
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([postData])
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

      if (formData.category_id && post) {
        const { error: categoryError } = await supabase
          .from('posts_categories')
          .insert([
            {
              post_id: post.id,
              category_id: formData.category_id
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
    }

    fetchPosts();
  };

  const handleDelete = async (postId: string) => {
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
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h3>
        <PostForm
          initialData={editingPost}
          onSubmit={handleSubmit}
          mode={editingPost ? 'edit' : 'create'}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Posts List</h3>
        <PostList
          posts={posts}
          onEdit={setEditingPost}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};