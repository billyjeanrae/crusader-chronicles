import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsItemFormProps {
  newItem: string;
  onItemChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const NewsItemForm = ({ 
  newItem, 
  onItemChange, 
  onSave, 
  onCancel, 
  isEditing 
}: NewsItemFormProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Input
        value={newItem}
        onChange={(e) => onItemChange(e.target.value)}
        placeholder="Enter news item..."
        className="flex-1"
      />
      <Button onClick={onSave}>
        {isEditing ? 'Update News' : 'Add News'}
      </Button>
      {isEditing && (
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
};