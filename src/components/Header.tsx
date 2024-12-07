import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">
              National Crusader
            </h1>
            <p className="text-secondary italic mt-1 text-sm">Truth is Life</p>
          </div>
          <nav className="hidden md:flex space-x-6">
            <NavLink href="#" label="Politics" />
            <NavLink href="#" label="Faith" />
            <NavLink href="#" label="Nation" />
            <NavLink href="#" label="World" />
            <NavLink href="#" label="Opinion" />
          </nav>
          <Button variant="ghost" className="md:hidden text-white">
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
    className="text-white hover:text-secondary transition-colors duration-200"
  >
    {label}
  </a>
);

export default Header;