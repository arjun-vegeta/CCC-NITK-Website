import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';

function AdminImageManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      alert('Error fetching images: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert(`Image is too large! Maximum size is 5MB.\nYour image: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      e.target.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type! Please upload an image file (JPG, PNG, GIF, SVG, or WebP).');
      e.target.value = '';
      return;
    }

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/images/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      await fetchImages();
      alert('Image uploaded successfully!');
    } catch (err) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/images/${filename}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete image');
      await fetchImages();
      alert('Image deleted successfully!');
    } catch (err) {
      alert('Error deleting image: ' + err.message);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Image Manager</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {images.length} image{images.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No images uploaded yet</p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload Your First Image
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.name}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden group"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {formatSize(image.size)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(image.url)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    >
                      {copiedUrl === image.url ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy URL
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(image.name)}
                      className="p-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminImageManager;
