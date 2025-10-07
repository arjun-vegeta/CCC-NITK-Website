import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminHomepageImageManager = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState({
    hero: [],
    stats: [],
    facilities: [],
    guides: []
  });
  const [selectedFolder, setSelectedFolder] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newImageName, setNewImageName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [customFileName, setCustomFileName] = useState('');

  const folders = [
    { key: 'hero', name: 'Hero Section', description: 'Images for the main hero carousel' },
    { key: 'stats', name: 'Stats Section', description: 'Icons and images for statistics' },
    { key: 'facilities', name: 'Facilities', description: 'Images showcasing facilities' },
    { key: 'guides', name: 'Guides', description: 'Icons and thumbnails for guides' }
  ];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Fetch all images
  const fetchImages = async () => {
    try {
      setLoading(true);
      console.log('Fetching images from:', `${process.env.REACT_APP_API_URL}/api/homepage-images`);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/homepage-images`);
      console.log('Fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched images:', data);
        console.log('Hero images count:', data.hero?.length || 0);
        console.log('Stats images count:', data.stats?.length || 0);
        console.log('Facilities images count:', data.facilities?.length || 0);
        console.log('Guides images count:', data.guides?.length || 0);
        setImages(data);
      } else {
        console.error('Failed to fetch images, status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error data:', errorData);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (uploadFile.size > maxSize) {
      alert(`Image is too large! Maximum size is 10MB.\nYour image: ${(uploadFile.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(uploadFile.type)) {
      alert('Invalid file type! Please upload an image file (JPG, PNG, GIF, SVG, or WebP).');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', uploadFile);
      if (customFileName) {
        formData.append('customName', customFileName);
      }

      console.log('Uploading to:', `${process.env.REACT_APP_API_URL}/api/homepage-images/${selectedFolder}/upload`);
      console.log('File:', uploadFile.name, 'Size:', uploadFile.size, 'Type:', uploadFile.type);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/homepage-images/${selectedFolder}/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: formData
        }
      );

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      alert('Image uploaded successfully!');
      await fetchImages();
      setShowUploadModal(false);
      setUploadFile(null);
      setCustomFileName('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (imageName) => {
    if (!window.confirm(`Are you sure you want to delete ${imageName}?`)) return;

    try {
      console.log('Deleting image:', imageName, 'from folder:', selectedFolder);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/homepage-images/${selectedFolder}/${imageName}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete image');
      }

      console.log('Image deleted successfully');
      alert('Image deleted successfully!');
      await fetchImages();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Error deleting image: ' + error.message);
    }
  };

  // Handle image rename
  const handleRename = async () => {
    if (!selectedImage || !newImageName) {
      alert('Please enter a new name');
      return;
    }

    try {
      console.log('Renaming image:', selectedImage.name, 'to:', newImageName);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/homepage-images/${selectedFolder}/${selectedImage.name}/rename`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({ newName: newImageName })
        }
      );

      console.log('Rename response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to rename image');
      }

      const data = await response.json();
      console.log('Rename successful:', data);
      
      alert('Image renamed successfully!');
      await fetchImages();
      setShowRenameModal(false);
      setSelectedImage(null);
      setNewImageName('');
    } catch (error) {
      console.error('Rename failed:', error);
      alert('Error renaming image: ' + error.message);
    }
  };

  const currentImages = images[selectedFolder] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Homepage Image Manager
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            Manage images for different sections of the homepage
          </p>
        </div>

        {/* Folder Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {folders.map((folder) => (
                <button
                  key={folder.key}
                  onClick={() => setSelectedFolder(folder.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedFolder === folder.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div>{folder.name}</div>
                    <div className="text-xs text-gray-400">{folder.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Upload Image to {folders.find(f => f.key === selectedFolder)?.name}
          </button>
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <AnimatePresence>
              {currentImages.map((image, index) => (
                <motion.div
                  key={image.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group"
                >
                  {/* Image */}
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Prevent infinite loop by only setting once
                        if (!e.target.dataset.errorHandled) {
                          e.target.dataset.errorHandled = 'true';
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"><span class="text-gray-500 dark:text-gray-400">Image not found</span></div>';
                        }
                      }}
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedImage(image);
                          setNewImageName(image.name.replace(/\.[^/.]+$/, ''));
                          setShowRenameModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                        title="Rename"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(image.name)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {image.url}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {currentImages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No images found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Upload some images to get started
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Upload Image to {folders.find(f => f.key === selectedFolder)?.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Filename (optional)
                  </label>
                  <input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder="Leave empty to use original name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {showRenameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowRenameModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Rename Image
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Name: {selectedImage?.name}
                  </label>
                  <input
                    type="text"
                    value={newImageName}
                    onChange={(e) => setNewImageName(e.target.value)}
                    placeholder="Enter new name (without extension)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  disabled={!newImageName}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md"
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHomepageImageManager;