import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      if (event === "SIGNED_IN") {
        uiToast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/");
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session);
      }
    });

    // Check for email_not_confirmed error in URL
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get('error_description');
    if (errorMessage === 'Email not confirmed') {
      toast.error("Please confirm your email address before logging in. Check your inbox for the confirmation link.");
    }

    return () => subscription.unsubscribe();
  }, [navigate, uiToast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back to National Crusader
        </p>
        {error && (
          <div className="mt-2 text-center text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#666666',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            onError={(error) => {
              console.error("Auth error:", error);
              if (error.message.includes('Email not confirmed')) {
                setError("Please confirm your email address before logging in. Check your inbox for the confirmation link.");
              } else {
                setError("Invalid login credentials. Please try again.");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;