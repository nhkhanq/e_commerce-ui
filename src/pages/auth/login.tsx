import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLoginMutation } from "@/api/auth/authApi";
import { LoginCredentials } from "@/interfaces";
import { decodeJWT } from "@/lib/utils";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(credentials).unwrap();
      console.log("Login response received:", response);

      if (response && response.result && response.result.accessToken) {
        console.log("Login successful, processing tokens");
        const { accessToken, refreshToken } = response.result;

        const decodedToken = decodeJWT(accessToken);
        console.log("Decoded token:", decodedToken);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: decodedToken.sub,
            permissions: decodedToken.scope.split(" "),
            tokenExpiry: decodedToken.exp * 1000,
          })
        );

        toast.success("Login successful! Redirecting...");

        setTimeout(() => {
          window.location.replace("/");
        }, 400);
      } else {
        console.error("Invalid response format:", response);
        toast.error("Login failed. Unexpected response format");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // More detailed error handling
      if (error?.data?.message) {
        toast.error(`Login failed: ${error.data.message}`);
      } else if (error?.message) {
        console.log(`Login failed: ${error.message}`);
      } else {
        toast.error(
          "Login failed. Please check your credentials and try again"
        );
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-800 to-transparent opacity-30 z-10 pointer-events-none" />

      <div className="md:col-span-4 bg-green-950 text-white p-6 flex flex-col justify-center relative z-20">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Sign In</h1>
            <p className="text-green-300">Access your organic food dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-100">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Write your email"
                  className="w-full px-4 py-3 bg-green-900/60 border border-green-700 focus:border-green-400 rounded-md text-white"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-100">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Write your password"
                  className="w-full px-4 py-3 bg-green-900/60 border border-green-700 focus:border-green-400 rounded-md text-white"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-green-300 hover:text-green-200 underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium"
              disabled={isLoading}
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a
              href="/register"
              className="text-sm text-green-300 hover:text-green-200 underline"
            >
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:col-span-8 bg-cover bg-center relative">
        <div className="absolute inset-0 bg-green-900/20" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.greenpasturesnursery.co.uk/wp-content/uploads/2020/07/norwich-farmshop.jpg')",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-green-950/80 to-transparent">
          <h2 className="text-3xl font-bold text-white mb-2">
            Green Pastures Farm Shop
          </h2>
          <p className="text-green-100">
            Fresh organic produce directly from our farms to your table
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
