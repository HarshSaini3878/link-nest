'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EditLinks from '../../components/component/Editlinks';
import EditProfile from '../../components/component/EditProfile';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [user, setUser] = useState({});
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Session Status:", status); // Log session status
    console.log("Session Data:", session);  // Log session data
    
    if (status === 'authenticated' && session?.user) {
      const fetchUserData = async () => {
        try {
          const userId = session.user.id;
          console.log("Fetched User ID: ", userId);  // Log user ID
          
          const response = await fetch(`/api/user/getUserInfo?userId=${userId}`);
          
          // Check if response is OK
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          
          const data = await response.json();
          console.log("Fetched Data:", data);  // Log fetched data
          
          if (data.success) {
            setUser(data.user);
          } else {
            console.error('Error fetching user data:', data.error);
            setError(data.error || 'Unknown error');
          }
        } catch (error) {
          console.error('Error in fetching user data:', error);
          setError(error.message || 'Unknown error');
        }
      };
  
      fetchUserData();
    }
  }, [session, status]);
  
  

  if (status === 'loading') {
    console.log("Session is loading...");
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-500 to-red-400">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    console.log("User is unauthenticated.");
    router.push('/signin');
    return null;
  }
  

  if (error) {
    return <div>Error: {error}</div>;  // Display the error to the user
  }
  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-500 to-red-400 flex justify-center items-start p-8 ${poppins.className}`}>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">
          Welcome to your Dashboard!
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-3 text-lg font-semibold rounded-lg cursor-pointer transition-all duration-300 ${
              !isEditingLinks
                ? 'bg-green-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
            onClick={() => setIsEditingLinks(false)}
          >
            Edit Profile
          </button>
          <button
            className={`px-6 py-3 text-lg font-semibold rounded-lg cursor-pointer transition-all duration-300 ${
              isEditingLinks
                ? 'bg-green-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
            onClick={() => setIsEditingLinks(true)}
          >
            Edit Links
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 w-full shadow-2xl">
          {isEditingLinks ? (
            <EditLinks user={user} />
          ) : (
            <EditProfile user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

