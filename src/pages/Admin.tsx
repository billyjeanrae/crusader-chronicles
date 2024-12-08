import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Panel</h1>
          <Button onClick={() => window.location.href = "/"}>
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
              {/* Post management interface will be implemented in the next iteration */}
            </div>
          )}
          {activeTab === "categories" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
              {/* Category management interface will be implemented in the next iteration */}
            </div>
          )}
          {activeTab === "subscribers" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Subscribers</h2>
              {/* Subscriber management interface will be implemented in the next iteration */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;