import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

interface TickerContentProps {
  news: Array<{ id: string; title: string }>;
  mode: 'black' | 'red';
}

export const TickerContent = ({ news, mode }: TickerContentProps) => {
  if (news.length === 0) return null;

  const animationDuration = mode === 'black' ? '20s' : '30s';

  return (
    <>
      {mode === 'red' && (
        <div className="flex items-center gap-2 px-4 absolute left-0 top-1/2 -translate-y-1/2 z-20">
          <AlertCircle className="h-4 w-4 text-red-400 animate-pulse" />
          <span className="font-semibold">BREAKING</span>
        </div>
      )}
      <div 
        className={`news-ticker whitespace-nowrap ${mode === 'red' ? 'pl-32' : 'pl-4'}`}
        style={{
          animation: `scroll ${animationDuration} linear infinite`,
          animationPlayState: 'running'
        }}
      >
        {news.map((item) => (
          <Link 
            key={item.id} 
            to={`/post/${item.id}`}
            className="mx-8 hover:text-secondary-foreground/80 transition-colors inline-block"
          >
            {item.title} •
          </Link>
        ))}
        {news.map((item) => (
          <Link 
            key={`${item.id}-duplicate`} 
            to={`/post/${item.id}`}
            className="mx-8 hover:text-secondary-foreground/80 transition-colors inline-block"
          >
            {item.title} •
          </Link>
        ))}
      </div>
    </>
  );
};