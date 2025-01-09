"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

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

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  const iconMap = {
    facebook: <Facebook className="w-5 h-5" />,
    github: <Github className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      {/* Profile Photo */}
      <motion.div
        className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <img
          src={userData.profilePicture || "/default-profile-picture.png"} // If no image, show default
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Username */}
      <h1 className="text-2xl font-bold">{userData.username}</h1>

      {/* Links */}
      <motion.div
        className="flex flex-col items-center space-y-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delayChildren: 0.2,
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
            className="text-lg text-blue-500 hover:text-blue-700 transition"
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
        className="flex space-x-4 mt-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {Object.entries(userData.socialMediaHandles).map(([platform, url]) => (
          url && (
            <li key={platform}>
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                {iconMap[platform.toLowerCase()]}
              </Link>
            </li>
          )
        ))}
      </motion.ul>
    </div>
  );
};

export default UserProfilePage;
