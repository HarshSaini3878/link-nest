'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([]);
  
  // Fetch user data if logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const fetchUserData = async () => {
        try {
          // Replace with your actual user ID or session user ID
          const userId = session.user.id;

          // Make an API call to fetch user info
          const response = await fetch(`/api/user/getUserInfo?userId=${userId}`);

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();

          if (data.success) {
            setName(data.user.username || '');
            setBio(data.user.bio || '');
            setLinks(data.user.links || []);
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
        {/* You can add a loading spinner or message here */}
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  return (
    <div className="p-4">
      <h1>Welcome to your Dashboard!</h1>
      <div>
        <h2>Name: {name}</h2>
        <p>Bio: {bio}</p>
        <div>
          <h3>Links:</h3>
          <ul>
            {links?.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
