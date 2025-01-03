"use client"
import React, { useState } from 'react';
import { Box, Button, Input, FormLabel, VStack, Text } from '@chakra-ui/react';
import { Toaster, toaster } from "../ui/toaster";
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
  const toast = useToast();

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
        toast({
          title: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.error || 'Failed to update profile',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'An error occurred while updating profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="lg" mx="auto" p="6" bg="gray.800" color="white" borderRadius="lg" boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="6">
        Edit Profile
      </Text>
      <VStack spacing="4" align="stretch">
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          name="username"
          value={profileData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />

        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          id="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          placeholder="Email"
          isDisabled
        />

        <FormLabel htmlFor="bio">Bio</FormLabel>
        <Input
          id="bio"
          name="bio"
          value={profileData.bio}
          onChange={handleInputChange}
          placeholder="Bio"
          maxLength="160"
        />

        <FormLabel htmlFor="profilePicture">Profile Picture URL</FormLabel>
        <Input
          id="profilePicture"
          name="profilePicture"
          value={profileData.profilePicture}
          onChange={handleProfilePictureChange}
          placeholder="Profile Picture URL"
        />
      </VStack>

      <Box mt="6">
        <Text fontSize="lg" fontWeight="bold" mb="2">
          Social Media Handles
        </Text>
        <VStack spacing="4" align="stretch">
          {Object.keys(profileData.socialMediaHandles).map((handle) => (
            <div key={handle}>
              <FormLabel htmlFor={handle}>{handle.charAt(0).toUpperCase() + handle.slice(1)}</FormLabel>
              <Input
                id={handle}
                name={handle}
                value={profileData.socialMediaHandles[handle]}
                onChange={handleSocialMediaChange}
                placeholder={`${handle.charAt(0).toUpperCase() + handle.slice(1)} URL`}
              />
            </div>
          ))}
        </VStack>
      </Box>

      <Button
        mt="6"
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={loading}
        loadingText="Updating..."
        width="full"
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProfile;
