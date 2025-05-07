import React from 'react';
import { motion } from 'framer-motion';
import { ZapIcon } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white rounded-full p-5 mb-5">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <ZapIcon size={64} className="text-primary-600" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl font-bold mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Robo<span className="text-secondary-500">Buzz</span>
        </motion.h1>
        
        <motion.p
          className="text-lg text-primary-100 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Premium Robotics Parts in Bangladesh
        </motion.p>
        
        <motion.div 
          className="mt-8 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="h-2 w-16 bg-white opacity-30 rounded-full"></div>
          <div className="h-2 w-4 bg-white rounded-full"></div>
          <div className="h-2 w-4 bg-white opacity-30 rounded-full"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;