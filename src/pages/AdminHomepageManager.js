import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, ChartColumnBig, Home, Upload, Image as ImageIcon, X } from 'lucide-react';

function AdminHomepageManager() {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/homepage`);
      if (!response.ok) throw new Error('Failed to fetch homepage data');
      const data = await response.json();
      setHomepageData(data);
    } catch (err) {
      alert('Error fetching homepage data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateData = () => {
    const errors = [];

    // Hero Section validation
    if (!homepageData.heroSection.title.trim()) {
      errors.push('Hero section title is required');
    }

    homepageData.heroSection.buttons.forEach((button, index) => {
      if (!button.text.trim()) errors.push(`Hero button ${index + 1} text is required`);
      if (!button.link.trim()) errors.push(`Hero button ${index + 1} link is required`);
    });

    homepageData.heroSection.images.forEach((image, index) => {
      if (!image.src.trim()) errors.push(`Hero image ${index + 1} source is required`);
      if (!image.alt.trim()) errors.push(`Hero image ${index + 1} alt text is required`);
      if (!image.label.trim()) errors.push(`Hero image ${index + 1} label is required`);
    });

    // Stats Section validation
    if (!homepageData.statsSection.title.trim()) {
      errors.push('Stats section title is required');
    }
    if (!homepageData.statsSection.subtitle.trim()) {
      errors.push('Stats section subtitle is required');
    }

    homepageData.statsSection.stats.forEach((stat, index) => {
      if (!stat.title.trim()) errors.push(`Stat ${index + 1} title is required`);
      if (!stat.image.trim()) errors.push(`Stat ${index + 1} image is required`);
      // description is optional for stats
    });

    // Facilities Section validation
    if (!homepageData.facilitiesSection.title.trim()) {
      errors.push('Facilities section title is required');
    }
    if (!homepageData.facilitiesSection.subtitle.trim()) {
      errors.push('Facilities section subtitle is required');
    }
    if (!homepageData.facilitiesSection.linkText.trim()) {
      errors.push('Facilities section link text is required');
    }
    if (!homepageData.facilitiesSection.linkUrl.trim()) {
      errors.push('Facilities section link URL is required');
    }

    homepageData.facilitiesSection.facilities.forEach((facility, index) => {
      if (!facility.name.trim()) errors.push(`Facility ${index + 1} name is required`);
      if (!facility.image.trim()) errors.push(`Facility ${index + 1} image is required`);
      if (!facility.description.trim()) errors.push(`Facility ${index + 1} description is required`);
    });

    // Guides Section validation
    if (!homepageData.guidesSection.title.trim()) {
      errors.push('Guides section title is required');
    }
    if (!homepageData.guidesSection.subtitle.trim()) {
      errors.push('Guides section subtitle is required');
    }
    if (!homepageData.guidesSection.buttonText.trim()) {
      errors.push('Guides section button text is required');
    }
    if (!homepageData.guidesSection.buttonLink.trim()) {
      errors.push('Guides section button link is required');
    }

    homepageData.guidesSection.guides.forEach((guide, index) => {
      if (!guide.heading.trim()) errors.push(`Guide ${index + 1} heading is required`);
      if (!guide.description.trim()) errors.push(`Guide ${index + 1} description is required`);
      if (!guide.image.trim()) errors.push(`Guide ${index + 1} image is required`);
      if (!guide.link.trim()) errors.push(`Guide ${index + 1} link is required`);
    });

    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateData();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }

    const token = localStorage.getItem('adminToken');
    setSaving(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/homepage`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homepageData),
      });

      if (!response.ok) throw new Error('Failed to save homepage data');

      setHasChanges(false);
      alert('Homepage updated successfully!');
    } catch (err) {
      alert('Error saving homepage data: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateData = (section, field, value, index = null) => {
    const newData = { ...homepageData };
    if (index !== null) {
      newData[section][field][index] = value;
    } else {
      newData[section][field] = value;
    }
    setHomepageData(newData);
    setHasChanges(true);
  };



  const openImageManager = (section, field, index = null, subField = null) => {
    setCurrentImageField({ section, field, index, subField });
    setShowImagePicker(true);
    fetchAvailableImages();
  };

  const fetchAvailableImages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/homepage-images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched images:', data);
        // Flatten the folder structure into a single array for the picker
        const allImages = [];
        Object.keys(data).forEach(folder => {
          data[folder].forEach(image => {
            allImages.push({
              ...image,
              folder: folder,
              displayName: `${folder}/${image.name}`
            });
          });
        });
        console.log('Available images after flatten:', allImages);
        setAvailableImages(allImages);
      } else {
        console.error('Failed to fetch images, status:', response.status);
      }
    } catch (err) {
      console.error('Failed to fetch homepage images:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Image is too large! Maximum size is 5MB.\nYour image: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      e.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type! Please upload an image file (JPG, PNG, GIF, SVG, or WebP).');
      e.target.value = '';
      return;
    }

    // Determine which folder to upload to based on current section
    let uploadFolder = 'hero'; // default
    if (activeSection === 'stats') uploadFolder = 'stats';
    else if (activeSection === 'facilities') uploadFolder = 'facilities';
    else if (activeSection === 'guides') uploadFolder = 'guides';

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/homepage-images/${uploadFolder}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      await fetchAvailableImages();
      selectImage(data.image.url);
    } catch (err) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const selectImage = (imageUrl) => {
    console.log('selectImage called with:', imageUrl);
    console.log('currentImageField:', currentImageField);
    
    if (!currentImageField) {
      console.error('No currentImageField set!');
      return;
    }

    const { section, field, index, subField } = currentImageField;
    const newData = { ...homepageData };

    if (index !== null && subField) {
      newData[section][field][index][subField] = imageUrl;
    } else if (index !== null) {
      newData[section][field][index] = imageUrl;
    } else {
      newData[section][field] = imageUrl;
    }

    console.log('Updated data:', newData[section][field]);
    setHomepageData(newData);
    setHasChanges(true);
    setShowImagePicker(false);
    setCurrentImageField(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homepage Manager</h1>
                {hasChanges && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">Unsaved changes</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/homepage-images')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
              >
                <ImageIcon className="h-4 w-4" />
                Manage Images
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'hero', name: 'Hero Section', icon: Home },
                { id: 'stats', name: 'Statistics', icon: ChartColumnBig },
                { id: 'facilities', name: 'Facilities', icon: ImageIcon },
                { id: 'guides', name: 'Guides', icon: Plus }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeSection === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        {activeSection === 'hero' && homepageData?.heroSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hero Section</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="mr-4">Buttons: {homepageData.heroSection.buttons.length}/3</span>
                <span>Images: {homepageData.heroSection.images.length}/3</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Main Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={homepageData.heroSection.title}
                onChange={(e) => updateData('heroSection', 'title', e.target.value)}
                placeholder="Enter the main hero title (e.g., CENTRAL COMPUTER CENTRE)"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Hero Buttons <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(3 buttons required)</span>
              </label>
              {homepageData.heroSection.buttons.map((button, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Button {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Button Text <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., VIEW GUIDES"
                        value={button.text}
                        onChange={(e) => updateData('heroSection', 'buttons', { ...button, text: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Link URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., /guides"
                        value={button.link}
                        onChange={(e) => updateData('heroSection', 'buttons', { ...button, link: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Button Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={button.type}
                        onChange={(e) => updateData('heroSection', 'buttons', { ...button, type: e.target.value }, index)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="outline">Outline (Border)</option>
                        <option value="filled">Filled (Solid)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Hero Images <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(3 images required)</span>
              </label>
              {homepageData.heroSection.images.map((image, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Image {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Image URL <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g., /hero/ccc.jpg"
                          value={image.src}
                          onChange={(e) => updateData('heroSection', 'images', { ...image, src: e.target.value }, index)}
                          required
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => openImageManager('heroSection', 'images', index, 'src')}
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg"
                          title="Select from gallery"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Alt Text <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., CCC Building"
                        value={image.alt}
                        onChange={(e) => updateData('heroSection', 'images', { ...image, alt: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Display Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., CCC Building"
                        value={image.label}
                        onChange={(e) => updateData('heroSection', 'images', { ...image, label: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        {activeSection === 'stats' && homepageData?.statsSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Statistics Section</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Stats: {homepageData.statsSection.stats.length}/4
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Providing Internet Access to Thousands Across Campus"
                  value={homepageData.statsSection.title}
                  onChange={(e) => updateData('statsSection', 'title', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Subtitle <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="e.g., CCC maintains the campus network backbone connectivity..."
                  value={homepageData.statsSection.subtitle}
                  onChange={(e) => updateData('statsSection', 'subtitle', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Statistics <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(4 statistics required)</span>
              </label>
              {homepageData.statsSection.stats.map((stat, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Statistic {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 6000+ Students and Staff"
                        value={stat.title}
                        onChange={(e) => updateData('statsSection', 'stats', { ...stat, title: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Description <span className="text-gray-500">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Additional description (optional)"
                        value={stat.description}
                        onChange={(e) => updateData('statsSection', 'stats', { ...stat, description: e.target.value }, index)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Icon/Image <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g., /stats/user.png"
                          value={stat.image}
                          onChange={(e) => updateData('statsSection', 'stats', { ...stat, image: e.target.value }, index)}
                          required
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => openImageManager('statsSection', 'stats', index, 'image')}
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg"
                          title="Select from gallery"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities Section */}
        {activeSection === 'facilities' && homepageData?.facilitiesSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Facilities Section</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Facilities: {homepageData.facilitiesSection.facilities.length}/4
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Some of our Facilities"
                  value={homepageData.facilitiesSection.title}
                  onChange={(e) => updateData('facilitiesSection', 'title', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Subtitle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Learn more about all the facilities provided by ccc"
                  value={homepageData.facilitiesSection.subtitle}
                  onChange={(e) => updateData('facilitiesSection', 'subtitle', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link Button Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Facilities Page"
                  value={homepageData.facilitiesSection.linkText}
                  onChange={(e) => updateData('facilitiesSection', 'linkText', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., /facilities"
                  value={homepageData.facilitiesSection.linkUrl}
                  onChange={(e) => updateData('facilitiesSection', 'linkUrl', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Facilities <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(4 facilities required)</span>
              </label>
              {homepageData.facilitiesSection.facilities.map((facility, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Facility {index + 1}</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Facility Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Data Centre & Server Infrastructure"
                        value={facility.name}
                        onChange={(e) => updateData('facilitiesSection', 'facilities', { ...facility, name: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="e.g., High-performance servers and secure data storage for all your business needs."
                        value={facility.description}
                        onChange={(e) => updateData('facilitiesSection', 'facilities', { ...facility, description: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Image <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g., /facilities/dc.jpg"
                          value={facility.image}
                          onChange={(e) => updateData('facilitiesSection', 'facilities', { ...facility, image: e.target.value }, index)}
                          required
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => openImageManager('facilitiesSection', 'facilities', index, 'image')}
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg"
                          title="Select from gallery"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guides Section */}
        {activeSection === 'guides' && homepageData?.guidesSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guides Section</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Guides: {homepageData.guidesSection.guides.length}/4
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Learn More About Guides"
                  value={homepageData.guidesSection.title}
                  onChange={(e) => updateData('guidesSection', 'title', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Subtitle <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="e.g., Discover guides to help you navigate the Central Computer Centre's services..."
                  value={homepageData.guidesSection.subtitle}
                  onChange={(e) => updateData('guidesSection', 'subtitle', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., View All Guides"
                  value={homepageData.guidesSection.buttonText}
                  onChange={(e) => updateData('guidesSection', 'buttonText', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., /guides"
                  value={homepageData.guidesSection.buttonLink}
                  onChange={(e) => updateData('guidesSection', 'buttonLink', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Guide Cards <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(4 guides required)</span>
              </label>
              {homepageData.guidesSection.guides.map((guide, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Guide {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Guide Heading <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Request For Subdomain"
                        value={guide.heading}
                        onChange={(e) => updateData('guidesSection', 'guides', { ...guide, heading: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Link URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., /guides/request-institute-url"
                        value={guide.link}
                        onChange={(e) => updateData('guidesSection', 'guides', { ...guide, link: e.target.value }, index)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="e.g., Instructions to request for subdomain (.nitk.ac.in)."
                      value={guide.description}
                      onChange={(e) => updateData('guidesSection', 'guides', { ...guide, description: e.target.value }, index)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      rows="2"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Icon/Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., /guides/url.png"
                        value={guide.image}
                        onChange={(e) => updateData('guidesSection', 'guides', { ...guide, image: e.target.value }, index)}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => openImageManager('guidesSection', 'guides', index, 'image')}
                        className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg"
                        title="Select from gallery"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Image</h3>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer text-sm">
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? 'Uploading...' : 'Upload New'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => {
                    setShowImagePicker(false);
                    setCurrentImageField(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {availableImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No images available</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload First Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableImages.map((image) => (
                    <button
                      key={image.displayName || image.name}
                      onClick={() => selectImage(image.url)}
                      className="group relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          Select
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                        <div className="truncate">{image.displayName || image.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHomepageManager;