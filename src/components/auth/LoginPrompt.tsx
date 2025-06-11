import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, UserPlus } from "lucide-react";

interface LoginPromptProps {
  title?: string;
  message?: string;
  onClose?: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  title = "Login Required",
  message = "Please login to access this feature.",
  onClose,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login to Continue
            </Button>

            <Button
              onClick={handleRegister}
              variant="outline"
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create New Account
            </Button>

            {onClose && (
              <Button onClick={onClose} variant="ghost" className="w-full">
                Continue as Guest
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPrompt;
