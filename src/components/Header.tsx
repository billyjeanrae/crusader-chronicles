import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="border-b border-gray-200 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="group">
            <h1 className="text-3xl font-serif font-bold text-white group-hover:text-secondary transition-colors">
              National Crusader
            </h1>
            <p className="text-secondary italic mt-1 text-sm">Truth is Life</p>
            <div className="flex justify-between text-[5px] text-gray-400 mt-1">
              <span className="text-left">RC:8075563</span>
              <span className="text-right ml-auto">ISSN:2184-0966</span>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <NavLink href="/politics" label="Politics" />
            <NavLink href="/faith" label="Faith" />
            <NavLink href="/nation" label="Nation" />
            <NavLink href="/world" label="World" />
            <NavLink href="/opinion" label="Opinion" />
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.email?.includes('admin') && (
                  <Button 
                    variant="outline" 
                    className="text-white hover:text-primary hover:bg-white"
                    onClick={() => navigate("/admin")}
                  >
                    Admin Panel
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="text-white hover:text-primary hover:bg-white"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="text-white hover:text-primary hover:bg-white"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="text-white hover:text-primary hover:bg-white"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button variant="ghost" className="md:hidden text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(href)}
      className="text-white hover:text-secondary transition-colors duration-200"
    >
      {label}
    </button>
  );
};

export default Header;