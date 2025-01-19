import React, { useState } from 'react';
import toast from 'react-hot-toast';
 import { Toaster } from 'react-hot-toast';
const EditLinks = ({ user }) => {
  const [links, setLinks] = useState(user.links || []);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLink({ ...newLink, [name]: value });
  };

  const handleSaveLink = () => {
    const { title, url, icon } = newLink;
    if (!title.trim() || !url.trim()) {
      toast.error('Please fill in both Title and URL');
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
      toast.error('Please enter a valid URL');
      return;
    }

    const updatedLinks =
      editingIndex !== null
        ? links.map((link, index) =>
            index === editingIndex ? { ...newLink } : link
          )
        : [...links, { title: title.trim(), url: url.trim(), icon: icon.trim() }];

    setLinks(updatedLinks);
    setNewLink({ title: '', url: '', icon: '' });
    setEditingIndex(null);
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleEditLink = (index) => {
    setEditingIndex(index);
    setNewLink({ ...links[index] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/user/updateLinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, links }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update links');
      }

      toast.success('Links updated successfully');
    } catch (error) {
      console.error('Error updating links:', error.message);
      toast.error(`Error updating links: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      
      <h2 className="text-2xl font-semibold mb-6">Your Links</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            value={newLink.title}
            onChange={handleInputChange}
            placeholder="Link Title"
            className="p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          />
          <input
            type="text"
            name="url"
            value={newLink.url}
            onChange={handleInputChange}
            placeholder="URL"
            className="p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          />
          <input
            type="text"
            name="icon"
            value={newLink.icon}
            onChange={handleInputChange}
            placeholder="Icon URL (optional)"
            className="p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          />
          <button
            type="button"
            onClick={handleSaveLink}
            className="py-3 px-6 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors duration-300"
          >
            {editingIndex !== null ? 'Update Link' : 'Add Link'}
          </button>
        </div>

        {links.length === 0 ? (
          <p className="text-center text-white/70 mt-4">No links added yet. Add your first link above!</p>
        ) : (
          <ul className="list-none p-0 mt-6 space-y-3">
            {links.map((link, index) => (
              <li key={index} className="flex justify-between items-center p-4 bg-white/10 rounded-lg transition-all duration-300 hover:bg-white/20">
                <div className="flex items-center gap-3">
                  {link.icon && <img src={link.icon || "/placeholder.svg"} alt="" className="w-8 h-8 object-cover rounded-full" />}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 transition-colors duration-300">
                    {link.title}
                  </a>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditLink(index)}
                    className="py-2 px-4 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="mt-6 py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save All Links'}
        </button>
      </form>
    </div>
  );
};

export default EditLinks;

