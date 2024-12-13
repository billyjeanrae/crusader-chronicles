import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PostsManager } from "@/components/admin/PostsManager";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { PagesManager } from "@/components/admin/PagesManager";
import { SubscribersManager } from "@/components/admin/SubscribersManager";
import { BreakingNewsManager } from "@/components/admin/BreakingNewsManager";
import { HomepageManager } from "@/components/admin/HomepageManager";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive"
      });
      navigate("/");
    }
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
            variant={activeTab === "pages" ? "default" : "outline"}
            onClick={() => setActiveTab("pages")}
          >
            Pages
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
          <Button
            variant={activeTab === "breaking-news" ? "default" : "outline"}
            onClick={() => setActiveTab("breaking-news")}
          >
            Breaking News
          </Button>
          <Button
            variant={activeTab === "homepage" ? "default" : "outline"}
            onClick={() => setActiveTab("homepage")}
          >
            Homepage
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "posts" && <PostsManager />}
          {activeTab === "pages" && <PagesManager />}
          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "subscribers" && <SubscribersManager />}
          {activeTab === "breaking-news" && <BreakingNewsManager />}
          {activeTab === "homepage" && <HomepageManager />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;