import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Mail, Phone, LogOut, Edit, ShoppingBag, Heart, CreditCard, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicURL, setProfilePicURL] = useState(currentUser?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Initialize form with current user data when it becomes available
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setPhone(currentUser.phone || '');
      setProfilePicURL(currentUser.photoURL || '');
    }
  }, [currentUser]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setProfilePicURL(URL.createObjectURL(file));
    }
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Upload new profile pic if changed
      let photoURL = currentUser.photoURL || '';
      if (profilePic) {
        const formData = new FormData();
        formData.append('image', profilePic);
        formData.append('key', 'c6c8326e0d3618587f09965473058916');
        
        const response = await axios.post('https://api.imgbb.com/1/upload', formData);
        photoURL = response.data.data.display_url;
      }
      
      // Update user profile in database
      // This would typically update the user profile in Firebase
      // For this demo we'll just pretend it worked
      
      setIsEditing(false);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      setLoading(false);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600">
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-24 h-24 rounded-full bg-white p-1 flex-shrink-0">
              {profilePicURL ? (
                <img 
                  src={profilePicURL} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={40} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : 'User'}
              </h1>
              <p className="text-primary-100">{currentUser.email}</p>
              {currentUser.phone && (
                <p className="text-primary-100">{currentUser.phone}</p>
              )}
            </div>
            
            <div className="md:ml-auto">
              <button 
                onClick={handleLogout}
                className="flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg"
              >
                <LogOut size={18} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'profile' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'orders' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'wishlist' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Wishlist
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'payments' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'reviews' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <Edit size={18} className="mr-1" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSaveProfile}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser.email || ''}
                      disabled
                      className="input-field bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  
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
                        <label className="btn-secondary inline-flex items-center cursor-pointer">
                          <input
                            type="file"
                            onChange={handleProfilePicChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <Edit size={16} className="mr-2" />
                          <span>Change Picture</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFirstName(currentUser.firstName || '');
                        setLastName(currentUser.lastName || '');
                        setPhone(currentUser.phone || '');
                        setProfilePicURL(currentUser.photoURL || '');
                        setProfilePic(null);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                      <p className="mt-1 text-gray-900">{currentUser.firstName || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                      <p className="mt-1 text-gray-900">{currentUser.lastName || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-gray-900">{currentUser.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="mt-1 text-gray-900">{currentUser.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Your Orders</h2>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Link to="/" className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            </div>
          )}
          
          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Your Wishlist</h2>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
                <Link to="/" className="btn-primary">
                  Discover Products
                </Link>
              </div>
            </div>
          )}
          
          {/* Payment Methods Tab */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Your Payment Methods</h2>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <CreditCard size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No payment methods saved yet.</p>
                <button className="btn-primary">
                  Add Payment Method
                </button>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Your Reviews</h2>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Star size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't reviewed any products yet.</p>
                <Link to="/" className="btn-primary">
                  Browse Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;