"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Pencil, Trash, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditLinks = ({ user }) => {
  const [links, setLinks] = useState(user.links || []);
  const [newLink, setNewLink] = useState({ title: "", url: "", icon: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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
        setLinks([ ...links, { ...newLink, title: newLink.title.trim(), url: newLink.url.trim(), icon: newLink.icon.trim() || "" } ]);
      }
      setNewLink({ title: "", url: "", icon: "" });
      setEditingIndex(null);
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Please fill in both title and URL",
        variant: "destructive",
      });
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
        body: JSON.stringify({ userId: user._id, links: links }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Links updated successfully",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update links");
      }
    } catch (error) {
      console.error("Error updating links:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating links",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
      <div className="text-2xl font-bold text-center mb-6">Your Links</div>

      {/* Add New Link Button */}
      <motion.button
        className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 block mx-auto"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Link
      </motion.button>

      {/* Modal to Add/Edit Link */}
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-[300px] md:w-[425px] relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newLink.title}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={newLink.url}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                  Icon URL
                </label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={newLink.icon}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveLink}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                >
                  {editingIndex !== null ? "Update" : "Add"} Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List of Links */}
      <AnimatePresence>
        {links.map((link, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4"
          >
            <div className="flex items-center space-x-3">
              {link.icon ? (
                <img src={link.icon} alt={link.title} className="w-6 h-6" />
              ) : (
                <LinkIcon className="w-6 h-6 text-gray-400" />
              )}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {link.title}
              </a>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditLink(index)}
                className="py-1 px-2 text-sm border border-gray-300 rounded-md hover:bg-gray-200"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRemoveLink(index)}
                className="py-1 px-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-100"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Updating..." : "Save All Links"}
        </button>
      </div>
    </div>
  );
};

export default EditLinks;
``
