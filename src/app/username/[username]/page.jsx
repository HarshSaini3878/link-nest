'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const { query } = useRouter(); // Get query parameters like username

  const { username } = query; // Access 'username' from the URL

  useEffect(() => {
    if (username) {
      // Fetch user profile data based on the username
      const fetchUserProfile = async () => {
        const response = await fetch(`/api/user/profile?username=${username}`);
        const data = await response.json();
        setUser(data); // Assuming the backend returns user data
      };

      fetchUserProfile();
    }
  }, [username]);

  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile: {username}</h1>
      {/* You can display the user profile data here */}
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Bio: {user.bio}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
