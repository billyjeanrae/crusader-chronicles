import { Button } from "@/components/ui/button";

interface PostListProps {
  posts: any[];
  onEdit: (post: any) => void;
  onDelete: (postId: string) => void;
}

export const PostList = ({ posts, onEdit, onDelete }: PostListProps) => {
  return (
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
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(post.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};