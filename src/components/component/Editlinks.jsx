"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Text,
  VStack,
  Flex,
  IconButton,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { Plus, Pencil, Trash, LinkIcon, CrossIcon, UtensilsCrossed } from "lucide-react";
import { Toaster, toaster } from "../ui/toaster";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog";

const EditLinks = ({ user }) => {
  const [links, setLinks] = useState(user.links || []);
  const [newLink, setNewLink] = useState({ title: "", url: "", icon: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const isValidURL = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!isValidURL(url)) {
      showToast("Please enter a valid URL", "warning");
      return;
    }

    const updatedLinks =
      editingIndex !== null
        ? links.map((link, index) =>
            index === editingIndex ? { ...newLink } : link
          )
        : [...links, { title: title.trim(), url: url.trim(), icon: icon.trim() }];

    setLinks(updatedLinks);
    setNewLink({ title: "", url: "", icon: "" });
    setEditingIndex(null);
    showToast(editingIndex !== null ? "Link updated" : "New link added", "success");
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
    showToast("Link removed", "info");
  };

  const handleEditLink = (index) => {
    setEditingIndex(index);
    setNewLink({ ...links[index] });
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
    <Flex
      justify="center"
      align="center"
      h="100vh"
      bgGradient="linear(to-r, green.400, blue.500)"
    >
      <div
        style={{
          maxWidth: "40rem",
          width: "100%",
          padding: "2rem",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="6" color="white">
          Your Links
        </Text>
        <Toaster />

        <DialogRoot>
          <DialogTrigger asChild>
            <IconButton
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              mb="4"
              w="full"
              onClick={() => setEditingIndex(null)} // Create new link
            >
              <Plus /> Add New Link
            </IconButton>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? "Edit Link" : "Add Link"}</DialogTitle>
            </DialogHeader>
            <DialogBody>
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
            </DialogBody>
            <DialogFooter>
              <IconButton
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                onClick={handleSaveLink}
              >
                Save
              </IconButton>
              <DialogCloseTrigger asChild={true}>
  <IconButton
    variant="ghost"
    aria-label="Close"
    size="sm"
    position="absolute"
    top="2"
    insetEnd="2"
  >
    <UtensilsCrossed color="#de1212" absoluteStrokeWidth />
  </IconButton>
</DialogCloseTrigger>

            </DialogFooter>
          </DialogContent>
        </DialogRoot>

        {links.length === 0 ? (
          <Text color="gray.400" textAlign="center">
            No links added yet. Click "Add New Link" to get started!
          </Text>
        ) : (
          <VStack spacing="4">
            {links.map((link, index) => (
              <Flex
                key={index}
                p="4"
                bg="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(5px)"
                rounded="md"
                w="full"
                justify="space-between"
                align="center"
                border="1px solid rgba(255, 255, 255, 0.2)"
              >
                <Flex align="center" gap="2">
                  {link.icon ? (
                    <Image src={link.icon} alt={link.title} boxSize="6" />
                  ) : (
                    <LinkIcon />
                  )}
                  <Text as="a" href={link.url} color="blue.300" target="_blank">
                    {link.title}
                  </Text>
                </Flex>
                <Flex gap="2">
                  <IconButton
                    size="sm"
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: "blue.600" }}
                    onClick={() => handleEditLink(index)}
                  >
                    <Pencil />
                  </IconButton>
                  <IconButton
                    size="sm"
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                    onClick={() => handleRemoveLink(index)}
                    aria-label="Delete link"
                  >
                    <Trash />
                  </IconButton>
                </Flex>
              </Flex>
            ))}
          </VStack>
        )}

        <Button
          bg="green.500"
          color="white"
          _hover={{ bg: "green.600" }}
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Updating..."
          w="full"
          mt="6"
        >
          Save All Links
        </Button>
      </div>
    </Flex>
  );
};

export default EditLinks;
