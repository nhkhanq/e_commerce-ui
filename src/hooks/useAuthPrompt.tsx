import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import LoginPrompt from "@/components/auth/LoginPrompt";

interface UseAuthPromptProps {
  title?: string;
  message?: string;
}

export const useAuthPrompt = ({ title, message }: UseAuthPromptProps = {}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isAuthenticated } = useAuth();

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      setShowPrompt(true);
    }
  };

  const closePrompt = () => {
    setShowPrompt(false);
  };

  const AuthPromptComponent = showPrompt ? (
    <LoginPrompt title={title} message={message} onClose={closePrompt} />
  ) : null;

  return {
    requireAuth,
    AuthPromptComponent,
    showPrompt,
    closePrompt,
  };
};
