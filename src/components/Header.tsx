import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-serif font-bold">
            National Crusader
          </h1>
          <nav className="hidden md:flex space-x-6">
            <NavLink href="#" label="Politics" />
            <NavLink href="#" label="Faith" />
            <NavLink href="#" label="Nation" />
            <NavLink href="#" label="World" />
            <NavLink href="#" label="Opinion" />
          </nav>
          <Button variant="ghost" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="text-primary hover:text-secondary transition-colors duration-200"
  >
    {label}
  </a>
);

export default Header;