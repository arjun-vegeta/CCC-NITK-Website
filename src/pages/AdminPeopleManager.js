import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react';

function AdminPeopleManager() {
  const [staff, setStaff] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [availableImages, setAvailableImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/people`);
      if (!response.ok) throw new Error('Failed to fetch people data');
      const data = await response.json();
      setStaff(data.staff);
      setTeam(data.team);
    } catch (err) {
      alert('Error fetching people data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate that Professor In-charge exists
    const hasProfessorInCharge = staff.some(person => person.position === 'Professor In-charge');
    if (!hasProfessorInCharge) {
      alert('Error: Professor In-charge is required. Please ensure at least one staff member has this position.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    setSaving(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/people`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staff, team }),
      });

      if (!response.ok) throw new Error('Failed to save people data');

      setHasChanges(false);
      alert('People data saved successfully!');
    } catch (err) {
      alert('Error saving people data: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addStaffMember = () => {
    setStaff([...staff, { name: '', position: '', image: '' }]);
    setHasChanges(true);
  };

  const addTeamMember = () => {
    setTeam([...team, { name: '', role: '', passingYear: '', image: '' }]);
    setHasChanges(true);
  };

  const updateStaff = (index, field, value) => {
    const newStaff = [...staff];
    newStaff[index][field] = value;
    setStaff(newStaff);
    setHasChanges(true);
  };

  const updateTeam = (index, field, value) => {
    const newTeam = [...team];
    newTeam[index][field] = value;
    setTeam(newTeam);
    setHasChanges(true);
  };

  const removeStaff = (index) => {
    const person = staff[index];
    if (person.position === 'Professor In-charge') {
      alert('Cannot remove Professor In-charge. This position is required.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter((_, i) => i !== index));
      setHasChanges(true);
    }
  };

  const removeTeam = (index) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setTeam(team.filter((_, i) => i !== index));
      setHasChanges(true);
    }
  };

  const openImageManager = (type, index) => {
    setCurrentImageField({ type, index });
    setShowImageManager(true);
    fetchAvailableImages();
  };

  const fetchAvailableImages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/people-images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const images = await response.json();
        setAvailableImages(images);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit for profile pictures)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Image is too large! Maximum size is 2MB for profile pictures.\nYour image: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      e.target.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type! Please upload an image file (JPG, PNG, or GIF).');
      e.target.value = '';
      return;
    }

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/people-images/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      await fetchAvailableImages();
      selectImage(data.name);
    } catch (err) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const selectImage = (imageName) => {
    if (!currentImageField) return;

    const { type, index } = currentImageField;
    if (type === 'staff') {
      updateStaff(index, 'image', imageName);
    } else {
      updateTeam(index, 'image', imageName);
    }

    setShowImageManager(false);
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage People</h1>
                {hasChanges && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">Unsaved changes</p>
                )}
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Staff Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Staff Members</h2>
            <button
              onClick={addStaffMember}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Staff
            </button>
          </div>

          <div className="space-y-4">
            {staff.map((person, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${person.position === 'Professor In-charge'
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                  : ''
                  }`}
              >
                {person.position === 'Professor In-charge' && (
                  <div className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Required Position - Cannot be removed or changed
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => updateStaff(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position {person.position === 'Professor In-charge' && <span className="text-red-600">*</span>}
                    </label>
                    <input
                      type="text"
                      value={person.position}
                      onChange={(e) => updateStaff(index, 'position', e.target.value)}
                      disabled={person.position === 'Professor In-charge'}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                      title={person.position === 'Professor In-charge' ? 'This position cannot be changed' : ''}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image Filename
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={person.image}
                          onChange={(e) => updateStaff(index, 'image', e.target.value)}
                          placeholder="e.g., person.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => openImageManager('staff', index)}
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                          title="Browse images"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeStaff(index)}
                      disabled={person.position === 'Professor In-charge'}
                      className="self-end p-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title={person.position === 'Professor In-charge' ? 'Cannot remove required position' : 'Remove'}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Website Team</h2>
            <button
              onClick={addTeamMember}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Team Member
            </button>
          </div>

          <div className="space-y-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeam(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateTeam(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {member.designation ? 'Designation' : 'Passing Year'}
                    </label>
                    <input
                      type="text"
                      value={member.passingYear || member.designation || ''}
                      onChange={(e) => {
                        const field = member.designation ? 'designation' : 'passingYear';
                        updateTeam(index, field, e.target.value);
                      }}
                      placeholder="2026 or designation"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image Filename
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={member.image}
                          onChange={(e) => updateTeam(index, 'image', e.target.value)}
                          placeholder="e.g., person.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => openImageManager('team', index)}
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                          title="Browse images"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTeam(index)}
                      className="self-end p-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Boxes */}
        <div className="mt-8 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-400">
              <strong>Important:</strong> The "Professor In-charge" position is required and cannot be removed or renamed.
              This information is displayed in the website footer. You can only update the name and image.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <strong>Tip:</strong> Click the <ImageIcon className="inline h-4 w-4" /> icon next to any image field to browse and upload profile pictures.
              Images are stored in <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">/public/People/</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Image Manager Modal */}
      {showImageManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Profile Picture</h3>
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
                    setShowImageManager(false);
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
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No profile pictures uploaded yet</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload First Picture'}
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
                      key={image.name}
                      onClick={() => selectImage(image.name)}
                      className="group relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium mb-1">
                          Select
                        </span>
                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                          {image.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Tip:</strong> Profile pictures should be square (e.g., 200x200px) and under 2MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPeopleManager;
