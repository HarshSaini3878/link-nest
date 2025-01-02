"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Box, Input, Text, VStack, Flex, IconButton, Spinner, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";
import { Plus, Pencil, Trash, LinkIcon } from "lucide-react";
import { Toaster, toaster } from "../ui/toaster"
const EditLinks = ({ user }) => {
  const [links, setLinks] = useState(user.links || []);
  const [newLink, setNewLink] = useState({ title: "", url: "", icon: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLink({ ...newLink, [name]: value });
  };

  const handleSaveLink = () => {
    if (newLink.title && newLink.url) {
      if (editingIndex !== null) {
        const updatedLinks = links.map((link, index) =>
          index === editingIndex ? { ...newLink } : link
        );
        setLinks(updatedLinks);
      } else {
        setLinks([...links, { ...newLink, title: newLink.title.trim(), url: newLink.url.trim(), icon: newLink.icon.trim() || "" }]);
      }
      setNewLink({ title: "", url: "", icon: "" });
      setEditingIndex(null);
      setIsDialogOpen(false);
    } else {
   
     
    }
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleEditLink = (index) => {
    setEditingIndex(index);
    setNewLink({ ...links[index] });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/user/updateLinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, links }),
      });

      if (response.ok) {
       
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update links");
      }
    } catch (error) {
      console.error("Error updating links:", error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="2xl" mx="auto" p="6" bg="white" shadow="lg" rounded="lg">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="6">
        Your Links
      </Text>

      {/* Add New Link Button */}
      <Button
        colorScheme="blue"
        leftIcon={<Plus />}
        onClick={() => setIsDialogOpen(true)}
        mb="4"
        w="full"
      >
        Add New Link
      </Button>

      {/* Modal to Add/Edit Link */}
      <Modal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingIndex !== null ? "Edit Link" : "Add Link"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">
              <Input
                placeholder="Title"
                name="title"
                value={newLink.title}
                onChange={handleInputChange}
              />
              <Input
                placeholder="URL"
                name="url"
                value={newLink.url}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Icon URL (optional)"
                name="icon"
                value={newLink.icon}
                onChange={handleInputChange}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveLink}>
              {editingIndex !== null ? "Update" : "Add"} Link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* List of Links */}
      <VStack spacing="4">
        {links.map((link, index) => (
          <Flex
            key={index}
            p="4"
            bg="gray.50"
            rounded="md"
            w="full"
            justify="space-between"
            align="center"
          >
            <Flex align="center" gap="2">
              {link.icon ? (
                <Image src={link.icon} alt={link.title} boxSize="6" />
              ) : (
                <LinkIcon />
              )}
              <Text as="a" href={link.url} color="blue.600" target="_blank">
                {link.title}
              </Text>
            </Flex>
            <Flex gap="2">
              <IconButton
                icon={<Pencil />}
                size="sm"
                onClick={() => handleEditLink(index)}
                aria-label="Edit link"
              />
              <IconButton
                icon={<Trash />}
                size="sm"
                colorScheme="red"
                onClick={() => handleRemoveLink(index)}
                aria-label="Delete link"
              />
            </Flex>
          </Flex>
        ))}
      </VStack>

      {/* Save Button */}
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={loading}
        loadingText="Updating..."
        w="full"
        mt="6"
      >
        Save All Links
      </Button>
    </Box>
  );
};

export default EditLinks;
