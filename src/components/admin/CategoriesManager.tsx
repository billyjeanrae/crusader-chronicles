import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const { toast } = useToast();

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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
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
  );
};