import { Button } from "@/components/ui/button";
import { Archive, Eye, EyeOff, Trash2, Edit } from "lucide-react";

interface PostListProps {
  posts: any[];
  onEdit: (post: any) => void;
  onDelete: (postId: string) => void;
  onArchive: (post: any) => void;
  onHide: (post: any) => void;
}

export const PostList = ({ posts, onEdit, onDelete, onArchive, onHide }: PostListProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <div key={post.id} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{post.title}</h3>
                {post.is_breaking_news && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    Breaking News
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">By {post.author?.email}</p>
              <p className="text-sm text-gray-600">Status: {post.status}</p>
              <p className="text-sm text-gray-600">
                Categories: {post.categories?.map((c: any) => c.category.name).join(', ')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchive(post)}
              >
                <Archive className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onHide(post)}
              >
                {post.is_hidden ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(post.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No posts found in this section
        </div>
      )}
    </div>
  );
};