"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Github, Linkedin, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from "next/link";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const UserProfilePage = () => {
  const { username } = useParams();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/profile?username=${username}`);
        const data = await response.json();

        if (response.ok) {
          setUserData(data.user);
          console.log(data.user);
        } else {
          setError(data.error || "User not found");
        }
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const iconMap = {
    facebook: <Facebook className="w-5 h-5" />,
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 ${poppins.className}`}>
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white text-2xl font-semibold"
          >
            Loading...
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white text-2xl font-semibold bg-red-600 px-6 py-3 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        ) : userData ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            {/* Profile Photo */}
            <motion.div
              className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-300 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <img
                src={userData.profilePicture || "/default-profile-picture.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Username */}
            <motion.h1
              className="text-3xl font-bold text-center mt-4 text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {userData.username}
            </motion.h1>

            {/* Bio */}
            {userData.bio && (
              <motion.p
                className="text-center text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {userData.bio}
              </motion.p>
            )}

            {/* Links */}
            <motion.div
              className="flex flex-col items-center space-y-3 mt-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.4,
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {userData.links.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-center font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-md"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {link.title}
                </motion.a>
              ))}
            </motion.div>

            {/* Social Media Handles */}
            <motion.ul
              className="flex justify-center space-x-4 mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {Object.entries(userData.socialMediaHandles).map(([platform, url]) => (
                url && (
                  <motion.li
                    key={platform}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
                    >
                      {iconMap[platform.toLowerCase()]}
                    </Link>
                  </motion.li>
                )
              ))}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default UserProfilePage;
