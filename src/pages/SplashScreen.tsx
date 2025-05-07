import React from 'react';
import { motion } from 'framer-motion';
import { ZapIcon } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex flex-col items-center justify-center text-white px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="flex flex-col items-center"
      >
        {/* Icon Section with Glow */}
        <div className="bg-white/10 rounded-full p-6 mb-6 shadow-xl backdrop-blur-md">
          <motion.div
            animate={{
              rotate: [0, 15, -15, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <ZapIcon size={64} className="text-yellow-400 drop-shadow-md" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-3 tracking-wide"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Robo<span className="text-yellow-300">Buzz</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-white/80 text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Premium Robotics Parts Delivered Nationwide in Bangladesh
        </motion.p>

        {/* Loader Pulse */}
        <motion.div
          className="mt-10 flex space-x-2 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
