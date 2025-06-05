import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useVNPayCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVNPayCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const hasVNPayParams = urlParams.has("vnp_ResponseCode") && urlParams.has("vnp_TxnRef");
      
      if (!hasVNPayParams) return;

      if (location.pathname === "/payment/vn-pay-callback") {
        return;
      }

      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const isNgrokUrl = currentUrl.includes("ngrok-free.app");
      
      // SSR-safe localStorage access
      const storedCallbackUrl = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
        ? localStorage.getItem("vnpay_callback_url") 
        : null;

      if (isNgrokUrl && import.meta.env.DEV && storedCallbackUrl) {
        const redirectUrl = `${storedCallbackUrl}?${urlParams.toString()}`;
        if (typeof window !== 'undefined') {
          window.location.href = redirectUrl;
        }
        return;
      }

      const newPath = `/payment/vn-pay-callback?${urlParams.toString()}`;
      navigate(newPath, { replace: true });
    };

    handleVNPayCallback();
  }, [location, navigate]);
}; 
