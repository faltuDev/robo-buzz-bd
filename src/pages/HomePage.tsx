import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { ChevronRight, ZapIcon, Truck, MessageCircle } from 'lucide-react';
import { Product, Category, Offer } from '../types';
import ProductCard from '../components/products/ProductCard';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsRef = ref(database, 'products');
        const productsSnapshot = await get(productsRef);
        
        if (productsSnapshot.exists()) {
          const products = Object.values(productsSnapshot.val()) as Product[];
          const featured = products.filter(product => product.featured);
          setFeaturedProducts(featured);
        }
        
        // Fetch categories
        const categoriesRef = ref(database, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        
        if (categoriesSnapshot.exists()) {
          setCategories(Object.values(categoriesSnapshot.val()) as Category[]);
        }
        
        // Fetch offers
        const offersRef = ref(database, 'offers');
        const offersSnapshot = await get(offersRef);
        
        if (offersSnapshot.exists()) {
          setOffers(Object.values(offersSnapshot.val()) as Offer[]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
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
      className="pb-8"
    >
      {/* Hero Slider */}
      <section className="mb-8">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="h-[240px] md:h-[400px]"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              <div 
                className="relative h-full w-full bg-cover bg-center flex items-center"
                style={{ backgroundImage: `url(${offer.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10 text-white">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">{offer.title}</h2>
                  <p className="text-xl md:text-3xl text-secondary-500 font-semibold mb-2">{offer.discount}</p>
                  <p className="mb-4 max-w-md">{offer.description}</p>
                  <Link 
                    to="/search" 
                    className="btn-primary inline-block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      
      {/* Categories */}
      <section className="container mx-auto px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Categories</h2>
          <Link to="/search?category=all" className="text-primary-600 flex items-center text-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="group"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-24 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium text-sm text-gray-800">{category.name}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="container mx-auto px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/search?featured=true" className="text-primary-600 flex items-center text-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Special Offer Banner */}
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-6 md:p-8 text-white md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Robotics Kit Bundle</h2>
              <p className="text-primary-100 mb-4">Get a complete robotics starter kit with Arduino, sensors, motors and more. Perfect for beginners!</p>
              <div className="mb-4">
                <span className="text-2xl font-bold">৳5,999</span>
                <span className="text-primary-200 line-through ml-2">৳7,500</span>
                <span className="bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded ml-2">SAVE 20%</span>
              </div>
              <Link to="/product/p6" className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-2 rounded-lg font-medium transition-colors inline-block">
                Shop Now
              </Link>
            </div>
            <div className="md:w-1/3 p-4 md:p-0">
              <img 
                src="https://i.ibb.co/8x9b2sv/robot-chassis.jpg" 
                alt="Robot Kit" 
                className="rounded-lg md:rounded-none object-cover h-48 w-full md:h-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="container mx-auto px-4 mb-8">
        <h2 className="section-title text-center">Why Choose RoboBuzz</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm text-center"
          >
            <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Free shipping on orders over ৳3000 and express delivery options available.</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm text-center"
          >
            <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ZapIcon size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
            <p className="text-gray-600">All products are carefully tested and come with manufacturer warranty.</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm text-center"
          >
            <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our customer support team is available 24/7 to assist you with any queries.</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;