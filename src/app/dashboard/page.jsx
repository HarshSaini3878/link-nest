'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Spinner, Box, Text } from '@chakra-ui/react'; // Chakra UI for buttons and spinner
import Editlinks from '../../components/component/Editlinks'; // Import EditLinks component
import EditProfile from '../../components/component/EditProfile'; // Import EditProfile component

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [user, setUser] = useState({});
  const [isEditingLinks, setIsEditingLinks] = useState(false); // State to toggle between edit sections
  
  // Fetch user data if logged in
  useEffect(() => {
    
    if (status === 'authenticated' && session?.user) {
      const fetchUserData = async () => {
        try {
          const userId = session.user.id;
             console.log(session,"session")
          // Make an API call to fetch user info
          const response = await fetch(`/api/user/getUserInfo?userId=${userId}`);

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
        console.log(data)
          if (data.success) {
            setUser(data.user);
          } else {
            console.error('Error fetching user data:', data.error);
          }
        } catch (error) {
          console.error('Error in fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Spinner size="xl" color="teal.500" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  const handleToggleEditLinks = () => {
    setIsEditingLinks(true); // Show EditLinks
  };

  const handleToggleEditProfile = () => {
    setIsEditingLinks(false); // Show EditProfile
  };

  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen">
      <Box textAlign="center" mb="8">
        <Text fontSize="2xl" fontWeight="bold">Welcome to your Dashboard!</Text>
      </Box>

      <div className="mt-8">
        {isEditingLinks ? (
          // Show EditLinks component
          <Editlinks user={user} />
        ) : (
          // Show EditProfile component
          <EditProfile user={user} />
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="mt-8 space-x-4 flex justify-center">
        <Button
          colorScheme="teal"
          onClick={handleToggleEditProfile}
          width="200px"
          variant={isEditingLinks ? 'ghost' : 'solid'}
          _hover={{ bg: 'teal.600' }}
        >
          Edit Profile
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleToggleEditLinks}
          width="200px"
          variant={isEditingLinks ? 'solid' : 'ghost'}
          _hover={{ bg: 'blue.600' }}
        >
          Edit Links
        </Button>
      </div>
    </div>
  );
}
