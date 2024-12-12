import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    <header className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="group">
            <h1 className="text-3xl font-serif font-bold text-white">
              National Crusader
            </h1>
            <p className="text-red-600 italic mt-1 text-sm">Truth is Life</p>
          </Link>
          <nav className="hidden md:flex space-x-8">
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
                    className="text-white border-white hover:bg-white hover:text-black"
                    onClick={() => navigate("/admin")}
                  >
                    Admin Panel
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-black"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-black"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-black"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
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
      className="text-white hover:text-red-600 transition-colors duration-200"
    >
      {label}
    </button>
  );
};

export default Header;