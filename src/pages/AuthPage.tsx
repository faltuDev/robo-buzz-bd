import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, User, Phone, Upload, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loginWithEmail, loginWithGoogle, signUp } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicURL, setProfilePicURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from || '/';
      navigate(from);
    }
  }, [currentUser, navigate, location.state]);
  
  const validateForm = () => {
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (!firstName || !lastName) {
        setError('First name and last name are required');
        return false;
      }
      
      if (!phone) {
        setError('Phone number is required');
        return false;
      }
      
      // Validate BD phone number (starts with +880 or 01)
      const bdPhoneRegex = /^(?:\+?880|0)1[3-9]\d{8}$/;
      if (!bdPhoneRegex.test(phone)) {
        setError('Please enter a valid Bangladesh phone number');
        return false;
      }
    }
    
    return true;
  };
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await loginWithEmail(email, password);
      
      // Redirect to previous page or home
      const from = location.state?.from || '/';
      navigate(from);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      
      // Redirect to previous page or home
      const from = location.state?.from || '/';
      navigate(from);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Upload profile pic to imgBB if selected
      let photoURL = '';
      if (profilePic) {
        const formData = new FormData();
        formData.append('image', profilePic);
        formData.append('key', 'c6c8326e0d3618587f09965473058916');
        
        const response = await axios.post('https://api.imgbb.com/1/upload', formData);
        photoURL = response.data.data.display_url;
      }
      
      // Create user
      await signUp(email, password, {
        firstName,
        lastName,
        phone,
        photoURL
      });
      
      // Switch to login mode after successful signup
      setIsLogin(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setProfilePic(null);
      setProfilePicURL('');
      
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setProfilePicURL(URL.createObjectURL(file));
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center py-12 px-4"
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Login to your account' : 'Create an account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your details to get started'
              }
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={isLogin ? handleEmailLogin : handleSignUp}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="John"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Phone Number (Bangladesh)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field pl-10"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}
            
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {profilePicURL ? (
                      <img 
                        src={profilePicURL} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="btn-secondary flex items-center justify-center cursor-pointer">
                      <Upload size={16} className="mr-2" />
                      <span>{profilePic ? 'Change Picture' : 'Upload Picture'}</span>
                      <input
                        type="file"
                        onChange={handleProfilePicChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Max size: 5MB. Supported formats: JPG, PNG
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  <span>{isLogin ? 'Login' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path 
                    d="M19.8 10.2c0-.63-.06-1.25-.16-1.86H10v3.51h5.52a4.75 4.75 0 01-2.04 3.12v2.6h3.32a10 10 0 003-8.37z" 
                    fill="#4285F4"
                  />
                  <path 
                    d="M10 20a9.72 9.72 0 006.76-2.5l-3.32-2.58a6.14 6.14 0 01-3.44.96 6.02 6.02 0 01-5.65-4.17H1v2.67A10 10 0 0010 20z" 
                    fill="#34A853"
                  />
                  <path 
                    d="M4.35 11.71a6.04 6.04 0 010-3.42V5.63H1a10.08 10.08 0 000 8.74l3.35-2.66z" 
                    fill="#FBBC05"
                  />
                  <path 
                    d="M10 3.96c1.69 0 3.2.58 4.4 1.72l2.93-2.93A9.8 9.8 0 0010 0 10 10 0 001 5.63l3.35 2.66A6.02 6.02 0 0110 3.96z" 
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;