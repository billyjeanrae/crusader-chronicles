import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "./posts/PostForm";
import { PostList } from "./posts/PostList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, postId: null });
  const [archiveDialog, setArchiveDialog] = useState({ open: false, post: null });
  const [hideDialog, setHideDialog] = useState({ open: false, post: null });
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
      author_id: session.user.id,
      is_breaking_news: formData.is_breaking_news
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
    setDeleteDialog({ open: false, postId: null });
    fetchPosts();
  };

  const handleArchiveToggle = async (post: any) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_archived: !post.is_archived })
      .eq('id', post.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update post archive status",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `Post ${post.is_archived ? 'unarchived' : 'archived'} successfully`
    });
    setArchiveDialog({ open: false, post: null });
    fetchPosts();
  };

  const handleVisibilityToggle = async (post: any) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_hidden: !post.is_hidden })
      .eq('id', post.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update post visibility",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `Post ${post.is_hidden ? 'shown' : 'hidden'} successfully`
    });
    setHideDialog({ open: false, post: null });
    fetchPosts();
  };

  return (
    <div className="space-y-8">
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

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Posts</TabsTrigger>
          <TabsTrigger value="archived">Archived Posts</TabsTrigger>
          <TabsTrigger value="hidden">Hidden Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <PostList
            posts={posts.filter((p: any) => !p.is_archived && !p.is_hidden)}
            onEdit={setEditingPost}
            onDelete={(id) => setDeleteDialog({ open: true, postId: id })}
            onArchive={(post) => setArchiveDialog({ open: true, post })}
            onHide={(post) => setHideDialog({ open: true, post })}
          />
        </TabsContent>

        <TabsContent value="archived">
          <PostList
            posts={posts.filter((p: any) => p.is_archived)}
            onEdit={setEditingPost}
            onDelete={(id) => setDeleteDialog({ open: true, postId: id })}
            onArchive={(post) => setArchiveDialog({ open: true, post })}
            onHide={(post) => setHideDialog({ open: true, post })}
          />
        </TabsContent>

        <TabsContent value="hidden">
          <PostList
            posts={posts.filter((p: any) => p.is_hidden)}
            onEdit={setEditingPost}
            onDelete={(id) => setDeleteDialog({ open: true, postId: id })}
            onArchive={(post) => setArchiveDialog({ open: true, post })}
            onHide={(post) => setHideDialog({ open: true, post })}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, postId: null })}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteDialog.postId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={archiveDialog.open} onOpenChange={(open) => setArchiveDialog({ open, post: null })}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {archiveDialog.post?.is_archived
                ? "Are you sure you want to unarchive this post?"
                : "Are you sure you want to archive this post?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleArchiveToggle(archiveDialog.post)}>
              {archiveDialog.post?.is_archived ? "Unarchive" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={hideDialog.open} onOpenChange={(open) => setHideDialog({ open, post: null })}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {hideDialog.post?.is_hidden
                ? "Are you sure you want to show this post?"
                : "Are you sure you want to hide this post?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleVisibilityToggle(hideDialog.post)}>
              {hideDialog.post?.is_hidden ? "Show" : "Hide"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};