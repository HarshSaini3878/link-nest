'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Poppins } from 'next/font/google';


const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const NotFoundPage = () => {
  

  return (
    <div className={`min-h-screen flex items-center justify-center  ${poppins.className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          className="w-64 h-64 mx-auto mb-8"
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-labelledby="notFoundTitle notFoundDesc">
            <title id="notFoundTitle">User Not Found Illustration</title>
            <desc id="notFoundDesc">A sad face icon with a magnifying glass</desc>
            <circle cx="100" cy="100" r="90" fill="#f3f4f6" />
            <circle cx="70" cy="80" r="10" fill="#4b5563" />
            <circle cx="130" cy="80" r="10" fill="#4b5563" />
            <path d="M65 125 Q100 100 135 125" stroke="#4b5563" strokeWidth="5" fill="none" />
            <circle cx="160" cy="160" r="30" fill="#9333ea" />
            <rect x="185" y="185" width="10" height="30" rx="5" transform="rotate(45, 190, 200)" fill="#4b5563" />
          </svg>
        </motion.div>
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          User Not Found
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sorry, we couldn't find the user you're looking for.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-block py-2 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-md"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
