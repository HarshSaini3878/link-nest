"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserProfilePage = () => {
  const { username } = useParams(); // Access username from dynamic route params

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
          setError(data.error || 'User not found');
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{userData.username}</h1>

      {/* Only render the image if profilePicture is not an empty string */}
      {userData.profilePicture ? (
        <img src={userData.profilePicture} alt="Profile" />
      ) : (
        <img src="/default-profile-picture.png" alt="Default Profile" />
      )}

      <p>{userData.bio}</p>
      {/* Render more user data */}
    </div>
  );
};

export default UserProfilePage;
