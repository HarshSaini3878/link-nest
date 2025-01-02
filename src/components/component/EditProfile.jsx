"use client"
import React, { useState } from 'react';

const EditProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',
    socialMediaHandles: user.socialMediaHandles || {
      facebook: '',
      github: '',
      linkedin: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle social media handle changes
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      socialMediaHandles: {
        ...profileData.socialMediaHandles,
        [name]: value
      }
    });
  };

  // Handle profile picture change (URL)
  const handleProfilePictureChange = (e) => {
    const { value } = e.target;
    setProfileData({
      ...profileData,
      profilePicture: value
    });
  };

  // Submit the updated profile data
  const handleSubmit = async () => {
    if (loading) return; // Prevent multiple submissions

    setLoading(true);

    try {
      const response = await fetch('/api/user/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id, // Assuming `user` object has an `_id` property
          profileData
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Edit Profile</h2>
      
      <div className="form-group">
        <input
          type="text"
          name="username"
          value={profileData.username}
          onChange={handleInputChange}
          placeholder="Username"
          className="border p-2 my-2 w-full"
        />
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="border p-2 my-2 w-full"
          disabled
        />
        <input
          type="text"
          name="bio"
          value={profileData.bio}
          onChange={handleInputChange}
          placeholder="Bio"
          maxLength="160"
          className="border p-2 my-2 w-full"
        />
        <input
          type="url"
          name="profilePicture"
          value={profileData.profilePicture}
          onChange={handleProfilePictureChange}
          placeholder="Profile Picture URL"
          className="border p-2 my-2 w-full"
        />
      </div>

      <div className="social-media-handles mt-4">
        <h3>Social Media Handles</h3>
        <input
          type="url"
          name="facebook"
          value={profileData.socialMediaHandles.facebook}
          onChange={handleSocialMediaChange}
          placeholder="Facebook URL"
          className="border p-2 my-2 w-full"
        />
        <input
          type="url"
          name="github"
          value={profileData.socialMediaHandles.github}
          onChange={handleSocialMediaChange}
          placeholder="GitHub URL"
          className="border p-2 my-2 w-full"
        />
        <input
          type="url"
          name="linkedin"
          value={profileData.socialMediaHandles.linkedin}
          onChange={handleSocialMediaChange}
          placeholder="LinkedIn URL"
          className="border p-2 my-2 w-full"
        />
        <input
          type="url"
          name="instagram"
          value={profileData.socialMediaHandles.instagram}
          onChange={handleSocialMediaChange}
          placeholder="Instagram URL"
          className="border p-2 my-2 w-full"
        />
        <input
          type="url"
          name="twitter"
          value={profileData.socialMediaHandles.twitter}
          onChange={handleSocialMediaChange}
          placeholder="Twitter URL"
          className="border p-2 my-2 w-full"
        />
        <input
          type="url"
          name="youtube"
          value={profileData.socialMediaHandles.youtube}
          onChange={handleSocialMediaChange}
          placeholder="YouTube URL"
          className="border p-2 my-2 w-full"
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
