import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/api/auth/authApi';
import { RegisterCredentials } from '@/interfaces';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterCredentials>>({});

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear error when editing the field
    if (errors[name as keyof RegisterCredentials]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<RegisterCredentials> = {};
    if (!credentials.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!credentials.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...registrationData } = credentials;
      const payload = { ...registrationData, roles: ['USER'] };

      await register(payload).unwrap();
      toast.success(
        'Registration successful',
        { description: 'Your account has been created successfully.' }
      );
      navigate('/login');
    } catch (error: any) {
      toast.error(
        'Registration failed',
        { description: error.data?.message || 'Failed to register. Please try again.' }
      );
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-800 to-transparent opacity-30 z-10 pointer-events-none" />
      <div className="md:col-span-4 bg-green-950 text-white p-6 flex flex-col justify-center relative z-20">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Sign Up</h1>
            <p className="text-green-300">Create your organic food account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First and Last Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-green-100">First Name</Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    className={`w-full px-4 py-3 bg-green-900/60 border ${errors.firstName ? 'border-red-500' : 'border-green-700 focus:border-green-400'} rounded-md text-white`}
                    value={credentials.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-green-100">Last Name</Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    className={`w-full px-4 py-3 bg-green-900/60 border ${errors.lastName ? 'border-red-500' : 'border-green-700 focus:border-green-400'} rounded-md text-white`}
                    value={credentials.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-100">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Write your email"
                    className={`w-full px-4 py-3 bg-green-900/60 border ${errors.email ? 'border-red-500' : 'border-green-700 focus:border-green-400'} rounded-md text-white`}
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-100">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 bg-green-900/60 border ${errors.password ? 'border-red-500' : 'border-green-700 focus:border-green-400'} rounded-md text-white`}
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
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-100">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 bg-green-900/60 border ${errors.confirmPassword ? 'border-red-500' : 'border-green-700 focus:border-green-400'} rounded-md text-white`}
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 mt-4 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a href="/login" className="text-sm text-green-300 hover:text-green-200 underline">
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:col-span-8 bg-cover bg-center relative">
        <div className="absolute inset-0 bg-green-900/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://www.greenpasturesnursery.co.uk/wp-content/uploads/2020/07/norwich-farmshop.jpg')" }} 
        />
        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-green-950/80 to-transparent">
          <h2 className="text-3xl font-bold text-white mb-2">Green Pastures Farm Shop</h2>
          <p className="text-green-100">Fresh organic produce directly from our farms to your table</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
