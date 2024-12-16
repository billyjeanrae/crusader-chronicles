import { Button } from "@/components/ui/button";

interface NewsItemListProps {
  items: string[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const NewsItemList = ({ items, onEdit, onRemove }: NewsItemListProps) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-background border rounded">
          <span>{item}</span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(index)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};