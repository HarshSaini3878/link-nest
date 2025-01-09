import React, { useEffect, useState } from "react";
import { Box, Button, Input, VStack, Text, Fieldset, IconButton, Grid, GridItem, Textarea, Image } from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import { Separator } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { FaFacebook, FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const EditProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    profilePicture: user.profilePicture || "",
    socialMediaHandles: user.socialMediaHandles || {
      facebook: "",
      Github: "",
      Linkedin: "",
      Instagram: "",
      Twitter: "",
      Youtube: "",
    },
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        socialMediaHandles: user.socialMediaHandles || {
          facebook: "",
          Github: "",
          Linkedin: "",
          Instagram: "",
          Twitter: "",
          Youtube: "",
        },
      });
    }
  }, [user]);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      socialMediaHandles: {
        ...profileData.socialMediaHandles,
        [name]: value,
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here, you can handle the file upload to your server or a service like Cloudinary
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);  // The file you want to upload
    formData.append("upload_preset", "LinkNest");  // The name of your unsigned upload preset
    formData.append("folder", "user_images"); // replace with your Cloudinary preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dskfkk0wf/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setProfileData({
          ...profileData,
          profilePicture: data.secure_url,
        });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      showToast("Failed to upload profile picture", "error");
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Ensure profileData has the latest profilePicture URL after upload
      const response = await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          profileData,  // Passing the full profileData including profilePicture URL
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        showToast("Profile updated successfully", "success");
      } else {
        showToast(data.error || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("An error occurred while updating profile", "error");
    } finally {
      setLoading(false);
    }
  };
  

  const showToast = (description, type = "info") => {
    toaster.create({ description, type });
  };

  return (
    <Box maxW="4xl" mx="auto" p="6" bg="gray.900" color="white" borderRadius="lg" boxShadow="xl">
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb="6">
        Edit Profile
      </Text>

      {/* Personal Information Section */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6" mb="8">
        <GridItem>
          <Fieldset.Root>
            <Fieldset.Legend fontSize="lg" fontWeight="semibold" color="gray.200">
              Personal Information
            </Fieldset.Legend>
            <Fieldset.Content>
              <div>
                <Field label htmlFor="username" style={{ display: "block", fontWeight: "normal" }}>
                  Username
                </Field>
                <Input
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  bgGradient="linear(to-r, teal.500, green.500)"
                  paddingX="4"
                  borderColor="gray.600"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" }}
                />
              </div>

              <div>
                <Field label htmlFor="email" style={{ display: "block", fontWeight: "normal" }}>
                  Email
                </Field>
                <Input
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  bgGradient="linear(to-r, teal.500, green.500)"
                  paddingX="4"
                  borderColor="gray.600"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" }}
                />
              </div>

              <div>
                <Field label htmlFor="bio" style={{ display: "block", fontWeight: "normal" }}>
                  Bio
                </Field>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a short bio"
                  maxLength="160"
                  bgGradient="linear(to-r, teal.500, green.500)"
                  paddingX="4"
                  borderColor="gray.600"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" }}
                  autoresize
                  colorPalette={'red'}
                />
              </div>

              <div>
                <Field label htmlFor="profilePicture" style={{ display: "block", fontWeight: "normal" }}>
                  Profile Picture
                </Field>
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  bgGradient="linear(to-r, teal.500, green.500)"
                  paddingX="4"
                  borderColor="gray.600"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" }}
                  variant={"subtle"}
                />
                {profileData.profilePicture && (
                  <Image src={profileData.profilePicture} alt="Profile Picture" boxSize="100px" objectFit="cover" mt="4" />
                )}
              </div>
            </Fieldset.Content>
          </Fieldset.Root>
        </GridItem>

        {/* Social Media Handles Section */}
        <GridItem>
          <Fieldset.Root>
            <Fieldset.Legend fontSize="lg" fontWeight="semibold" color="gray.200">
              Social Media Handles
            </Fieldset.Legend>
            <Fieldset.Content>
              <Separator borderColor="gray.600" />
              {Object.keys(profileData.socialMediaHandles).map((handle) => (
                <div key={handle} style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <IconButton aria-label={handle} bg="gray.700" borderColor="gray.600" size="sm" mr="4">
                    {getIconForHandle(handle)}
                  </IconButton>
                  <Field label htmlFor={handle} style={{ display: "block", fontWeight: "normal" }}>
                    {handle.charAt(0).toUpperCase() + handle.slice(1)}
                  </Field>
                  <Input
                    id={handle}
                    name={handle}
                    value={profileData.socialMediaHandles[handle]}
                    onChange={handleSocialMediaChange}
                    placeholder={`${handle.charAt(0).toUpperCase() + handle.slice(1)} URL`}
                    bgGradient="linear(to-r, teal.500, green.500)"
                    paddingX="4"
                    borderColor="gray.600"
                    _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #38A169" }}
                  />
                </div>
              ))}
            </Fieldset.Content>
          </Fieldset.Root>
        </GridItem>
      </Grid>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        isLoading={loading}
        loadingText="Saving"
        colorScheme="green"
        size="lg"
        width="100%"
        mt="4"
      >
        Save Changes
      </Button>
    </Box>
  );
  function getIconForHandle(handle) {
    switch (handle) {
      case "facebook":
        return <FaFacebook size="24px" />;
      case "Github":
        return <FaGithub size="24px" />;
      case "Linkedin":
        return <FaLinkedin size="24px" />;
      case "Instagram":
        return <FaInstagram size="24px" />;
      case "Twitter":
        return <FaTwitter size="24px" />;
      case "Youtube":
        return <FaYoutube size="24px" />;
      default:
        return null;
    }
  }
};

export default EditProfile;
