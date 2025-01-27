"use client"
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const EditProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
    socialMediaHandles: {
      facebook: '',
      github: '',
      linkedin: '',
      instagram: '',
      twitter: '',
      youtube: '',
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
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
          youtube: '',
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      socialMediaHandles: {
        ...prevData.socialMediaHandles,
        [name]: value,
      },
    }));
  };
  const uploadStagedFile = async (stagedFile) => {
    const form = new FormData();
    form.set("file", stagedFile); // Set the file from the input
  
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
        headers: {
          // You can add auth token headers here if required
        },
      });
  
      const data = await res.json();
      if (data.imgUrl) {
        console.log("File uploaded successfully:", data.imgUrl);
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'LinkNest');
        formData.append('folder', 'user_images');

        const response = await fetch('https://api.cloudinary.com/v1_1/dskfkk0wf/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          setProfileData((prevData) => ({
            ...prevData,
            profilePicture: data.secure_url,
          }));
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        toast.error('Failed to upload profile picture');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/user/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          profileData,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
     
      <h2 className="text-2xl font-semibold text-white mb-4">Edit Profile</h2>

      <div className="flex flex-col">
        <label htmlFor="username" className="text-white mb-2 font-medium">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={profileData.username}
          onChange={handleInputChange}
          className="p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="text-white mb-2 font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          className="p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="bio" className="text-white mb-2 font-medium">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={profileData.bio}
          onChange={handleInputChange}
          className="p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 resize-y min-h-[100px]"
          maxLength={200}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="profilePicture" className="text-white mb-2 font-medium">Profile Picture</label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          onChange={handleFileChange}
          className="p-3 border border-white/30 rounded-lg bg-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          accept="image/*"
        />
        {profileData.profilePicture && (
          <img src={profileData.profilePicture || "/placeholder.svg"} alt="Profile" className="w-24 h-24 object-cover rounded-full mt-4" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-white mt-6 mb-4">Social Media Handles</h3>
      {Object.keys(profileData.socialMediaHandles).map((platform) => (
        <div key={platform} className="flex flex-col mb-4">
          <label htmlFor={platform} className="text-white mb-2 font-medium capitalize">{platform}</label>
          <input
            type="text"
            id={platform}
            name={platform}
            value={profileData.socialMediaHandles[platform]}
            onChange={handleSocialMediaChange}
            className="p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            placeholder={`${platform} URL`}
          />
        </div>
      ))}

      <button 
        type="submit" 
        className="bg-green-500 text-white p-4 rounded-lg cursor-pointer text-lg font-semibold transition-all duration-300 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditProfile;

