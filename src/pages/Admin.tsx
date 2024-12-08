import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", excerpt: "" });
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchSubscribers();
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

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*');
    if (error) {
      console.error('Error fetching subscribers:', error);
      return;
    }
    setSubscribers(data || []);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('categories')
      .insert([newCategory]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Category created successfully"
    });
    setNewCategory({ name: "", description: "" });
    fetchCategories();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Panel</h1>
          <Button onClick={() => navigate("/")}>
            View Site
          </Button>
        </div>

        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === "posts" ? "default" : "outline"}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </Button>
          <Button
            variant={activeTab === "subscribers" ? "default" : "outline"}
            onClick={() => setActiveTab("subscribers")}
          >
            Subscribers
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "posts" && (
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
          )}
          
          {activeTab === "categories" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
              
              <form onSubmit={handleCreateCategory} className="mb-8 space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                </div>
                <Button type="submit">Create Category</Button>
              </form>

              <div className="space-y-4">
                {categories.map((category: any) => (
                  <div key={category.id} className="p-4 border rounded">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "subscribers" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Subscribers</h2>
              <div className="space-y-4">
                {subscribers.map((subscriber: any) => (
                  <div key={subscriber.id} className="p-4 border rounded">
                    <p>{subscriber.email}</p>
                    <p className="text-sm text-gray-600">
                      Status: {subscriber.is_verified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;