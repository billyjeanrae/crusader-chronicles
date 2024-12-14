import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Login = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [showEmailConfirmDialog, setShowEmailConfirmDialog] = useState(false);

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
      } else if (event === "SIGNED_OUT") {
        setError(null);
      }
    });

    // Check for email_not_confirmed error in URL
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get('error_description');
    if (errorMessage === 'Email not confirmed') {
      setError("Please confirm your email address before logging in. Check your inbox for the confirmation link.");
      setShowEmailConfirmDialog(true);
      toast.error("Please confirm your email address before logging in.");
    }

    return () => subscription.unsubscribe();
  }, [navigate, uiToast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-serif font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          Welcome back to National Crusader
        </p>
        {error && !showEmailConfirmDialog && (
          <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-center text-sm text-red-600">
              {error}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
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
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'gap-4',
                button: 'bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 font-medium transition-colors',
                input: 'rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                label: 'text-sm font-medium text-gray-700',
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>

      <AlertDialog open={showEmailConfirmDialog} onOpenChange={setShowEmailConfirmDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Email Confirmation Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please check your email inbox for the confirmation link. You need to verify your email address before you can log in.
              If you don't see the email, please check your spam folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;