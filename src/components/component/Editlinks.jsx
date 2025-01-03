"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Flex,
  IconButton,
  Spinner,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Plus, Pencil, Trash, LinkIcon } from "lucide-react";
import { Toaster, toaster } from "../ui/toaster";

const EditLinks = ({ user }) => {
  const [links, setLinks] = useState(user.links || []);
  const [newLink, setNewLink] = useState({ title: "", url: "", icon: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Utility function for URL validation
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLink({ ...newLink, [name]: value });
  };

  const showToast = (description, type = "info") => {
    toaster.create({ description, type });
  };

  const handleSaveLink = () => {
    const { title, url, icon } = newLink;

    if (!title.trim() || !url.trim()) {
      showToast("Please fill in both Title and URL", "warning");
      return;
    }

    if (!isValidURL(url)) {
      showToast("Please enter a valid URL", "warning");
      return;
    }

    const updatedLinks = editingIndex !== null
      ? links.map((link, index) =>
          index === editingIndex ? { ...newLink } : link
        )
      : [...links, { title: title.trim(), url: url.trim(), icon: icon.trim() }];

    setLinks(updatedLinks);
    setNewLink({ title: "", url: "", icon: "" });
    setEditingIndex(null);
    setIsDialogOpen(false);
    showToast(editingIndex !== null ? "Link updated" : "New link added", "success");
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
    showToast("Link removed", "info");
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update links");
      }

      showToast("Links updated successfully", "success");
    } catch (error) {
      console.error("Error updating links:", error.message);
      showToast(`Error updating links: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="2xl" mx="auto" p="6" bg="white" shadow="lg" rounded="lg">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="6">
        Your Links
      </Text>
      <Toaster />

      <Button
        colorScheme="blue"
        leftIcon={<Plus />}
        onClick={() => setIsDialogOpen(true)}
        mb="4"
        w="full"
      >
        Add New Link
      </Button>

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

      {links.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          No links added yet. Click "Add New Link" to get started!
        </Text>
      ) : (
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
      )}

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
