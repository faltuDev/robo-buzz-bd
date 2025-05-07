import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ChevronLeft,
  User,
  LogOut,
  Edit,
  Heart,
  ShoppingBag,
  CreditCard,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { database } from '../firebase/config';
import { ref, set } from 'firebase/database';
import { getAuth, updateProfile } from 'firebase/auth';

const TAB_NAMES = ['profile', 'orders', 'wishlist', 'payments', 'reviews'] as const;
type Tab = typeof TAB_NAMES[number];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.4 } },
  exit:  { opacity: 0, transition: { duration: 0.2 } },
};

const tabContentVariants: Variants = {
  hidden:    { x: 50, opacity: 0 },
  visible:   { x: 0,  opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:      { x: -50, opacity: 0, transition: { duration: 0.2 } },
};

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [initialLoading, setInitialLoading] = useState(true);

  // form state
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [profilePic, setProfilePic]       = useState<File|null>(null);
  const [profilePicURL, setProfilePicURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setFirstName(currentUser.firstName || '');
    setLastName(currentUser.lastName   || '');
    setPhone(currentUser.phone         || '');
    setProfilePicURL(currentUser.photoURL || '');
    setTimeout(() => setInitialLoading(false), 300); // slight delay for skeleton
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfilePic(file);
      setProfilePicURL(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    setError('');

    try {
      let photoURL = currentUser.photoURL || '';
      if (profilePic) {
        const form = new FormData();
        form.append('image', profilePic);
        form.append('key', 'c6c8326e0d3618587f09965473058916');
        const res = await axios.post('https://api.imgbb.com/1/upload', form);
        photoURL = res.data.data.display_url;
      }
      await updateProfile(auth.currentUser!, {
        displayName: `${firstName} ${lastName}`.trim(),
        photoURL,
      });
      await set(ref(database, `users/${currentUser.uid}`), {
        firstName, lastName, phone, photoURL,
        email: currentUser.email,
        updatedAt: Date.now(),
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    // skeleton loader
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="enter"
        className="container mx-auto px-4 py-6"
      >
        <div className="animate-pulse flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-4 py-1">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="container mx-auto px-4 py-6"
    >
      {/* Back */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600">
          <ChevronLeft size={20} /><span className="ml-2">Back to Home</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <motion.div
            style={{ perspective: 800 }}
            className="w-28 h-28 rounded-full bg-white p-1 flex-shrink-0 cursor-pointer"
            whileHover={{ rotateY: 15, rotateX: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          >
            {profilePicURL
              ? <img src={profilePicURL} className="w-full h-full object-cover rounded-full" />
              : <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                  <User size={48} className="text-gray-400" />
                </div>
            }
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <motion.h1 layout className="text-3xl font-extrabold">
              {firstName || lastName
                ? `${firstName} ${lastName}`.trim()
                : 'User'}
            </motion.h1>
            <motion.p layout className="mt-1 text-primary-100">{currentUser.email}</motion.p>
            {phone && <motion.p layout className="mt-1 text-primary-100">{phone}</motion.p>}
          </div>

          <motion.div layout className="md:ml-auto">
            <button
              onClick={handleLogout}
              className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              <LogOut size={18} className="mr-2" /><span>Logout</span>
            </button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-t border-gray-100">
          <nav className="flex overflow-x-auto">
            {TAB_NAMES.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-center font-medium transition ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-4 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {activeTab === 'profile' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-primary-600 hover:text-primary-700 transition"
                  >
                    <Edit size={18} className="mr-1" /> Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <motion.form
                  layout
                  onSubmit={handleSaveProfile}
                  className="space-y-6"
                >
                  {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', value: firstName, setter: setFirstName },
                      { label: 'Last Name',  value: lastName,  setter: setLastName },
                    ].map(({ label, value, setter }) => (
                      <div key={label}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                          type="text"
                          value={value}
                          onChange={e => setter(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={currentUser.email || ''}
                      disabled
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden">
                        {profilePicURL
                          ? <img src={profilePicURL} className="w-full h-full object-cover" />
                          : <User size={32} className="text-gray-400" />
                        }
                      </div>
                      <label className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="hidden"
                        />
                        <Edit size={16} className="mr-2" /> Change
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-primary-600 text-white py-2 rounded-lg shadow hover:bg-primary-700 transition"
                    >
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFirstName(currentUser.firstName || '');
                        setLastName(currentUser.lastName   || '');
                        setPhone(currentUser.phone         || '');
                        setProfilePicURL(currentUser.photoURL || '');
                        setProfilePic(null);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              ) : (
                <div className="space-y-6">
                  {[
                    ['First Name', currentUser.firstName],
                    ['Last Name',  currentUser.lastName ],
                    ['Email',      currentUser.email    ],
                    ['Phone',      currentUser.phone    ],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
                      <p className="mt-1 text-gray-900">{val || 'Not provided'}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="text-center space-y-6">
              <ShoppingBag size={64} className="text-gray-300 mx-auto" />
              <h2 className="text-2xl font-bold">Your Orders</h2>
              <p className="text-gray-600">You haven't placed any orders yet.</p>
              <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-700 transition">
                Start Shopping
              </Link>
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="text-center space-y-6">
              <Heart size={64} className="text-gray-300 mx-auto" />
              <h2 className="text-2xl font-bold">Your Wishlist</h2>
              <p className="text-gray-600">Your wishlist is empty.</p>
              <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-700 transition">
                Discover Products
              </Link>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="text-center space-y-6">
              <CreditCard size={64} className="text-gray-300 mx-auto" />
              <h2 className="text-2xl font-bold">Your Payment Methods</h2>
              <p className="text-gray-600">No payment methods saved yet.</p>
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-700 transition">
                Add Payment Method
              </button>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="text-center space-y-6">
              <Star size={64} className="text-gray-300 mx-auto" />
              <h2 className="text-2xl font-bold">Your Reviews</h2>
              <p className="text-gray-600">You haven't reviewed any products yet.</p>
              <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-700 transition">
                Browse Products
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;
