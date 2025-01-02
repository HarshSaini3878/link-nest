"use client"
import React, { useState } from 'react';

const EditLinks = ({ user }) => {
  const [links, setLinks] = useState(user.links || []);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: ''
  });
  const [editingIndex, setEditingIndex] = useState(null); // Index of the link being edited
  const [loading, setLoading] = useState(false);

  // Handle input changes for the new or edited link
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLink({
      ...newLink,
      [name]: value
    });
  };

  // Add a new link or update an existing link
  const handleSaveLink = () => {
    if (newLink.title && newLink.url) {
      if (editingIndex !== null) {
        // Update the existing link
        const updatedLinks = links.map((link, index) =>
          index === editingIndex ? { ...newLink } : link
        );
        setLinks(updatedLinks);
      } else {
        // Add a new link
        setLinks([
          ...links,
          {
            ...newLink,
            title: newLink.title.trim(),
            url: newLink.url.trim(),
            icon: newLink.icon.trim() || ''
          }
        ]);
      }
      setNewLink({ title: '', url: '', icon: '' }); // Reset the form
      setEditingIndex(null); // Reset editing state
    } else {
      alert('Please fill in both title and URL');
    }
  };

  // Remove a link from the list
  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Edit a link and populate the form with its details
  const handleEditLink = (index) => {
    setEditingIndex(index);
    setNewLink({
      title: links[index].title,
      url: links[index].url,
      icon: links[index].icon || ''
    });
  };

  // Submit the updated links to the backend API
  const handleSubmit = async () => {
    if (loading) return; // Prevent multiple submissions

    setLoading(true);

    try {
      const response = await fetch('/api/user/updateLinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id, // Assuming `user` object has an `_id` property
          links: links
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Links updated successfully');
      } else {
        alert(data.error || 'Failed to update links');
      }
    } catch (error) {
      console.error('Error updating links:', error);
      alert('An error occurred while updating links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Edit Links</h2>
      
      <div className="add-link-form">
        <input
          type="text"
          name="title"
          value={newLink.title}
          onChange={handleInputChange}
          placeholder="Link Title"
          className="border p-2 my-2"
        />
        <input
          type="url"
          name="url"
          value={newLink.url}
          onChange={handleInputChange}
          placeholder="Link URL"
          className="border p-2 my-2"
        />
        <input
          type="text"
          name="icon"
          value={newLink.icon}
          onChange={handleInputChange}
          placeholder="Icon URL (Optional)"
          className="border p-2 my-2"
        />
        <button
          onClick={handleSaveLink}
          className="bg-green-500 text-white px-4 py-2 mt-2"
        >
          {editingIndex !== null ? 'Update Link' : 'Add Link'}
        </button>
      </div>

      <div className="links-list mt-4">
        <h3>Links</h3>
        {links.length === 0 ? (
          <p>No links added yet</p>
        ) : (
          <ul>
            {links.map((link, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {link.icon && <img src={link.icon} alt={link.title} className="w-6 h-6 mr-2" />}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {link.title}
                  </a>
                </div>
                <button
                  onClick={() => handleEditLink(index)}
                  className="bg-yellow-500 text-white px-4 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="bg-red-500 text-white px-4 py-1"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Save Links'}
        </button>
      </div>
    </div>
  );
};

export default EditLinks;
