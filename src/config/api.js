// API Configuration
// This file centralizes all API endpoint configuration

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  VERIFY_TOKEN: `${API_BASE_URL}/api/auth/verify`,

  // MDX Content
  MDX_PUBLIC: (category) => `${API_BASE_URL}/api/mdx/public/${category}`,
  MDX_PUBLIC_FILE: (category, filename) => `${API_BASE_URL}/api/mdx/public/${category}/${filename}`,
  MDX_ADMIN: (category) => `${API_BASE_URL}/api/mdx/${category}`,
  MDX_ADMIN_FILE: (category, filename) => `${API_BASE_URL}/api/mdx/${category}/${filename}`,
  MDX_SYNC: `${API_BASE_URL}/api/mdx/sync`,

  // Images
  IMAGES: `${API_BASE_URL}/api/images`,
  IMAGES_UPLOAD: `${API_BASE_URL}/api/images/upload`,
  IMAGES_DELETE: (filename) => `${API_BASE_URL}/api/images/${filename}`,

  // People
  PEOPLE: `${API_BASE_URL}/api/people`,
  PEOPLE_IMAGES: `${API_BASE_URL}/api/people-images`,
  PEOPLE_IMAGES_UPLOAD: `${API_BASE_URL}/api/people-images/upload`,
  PEOPLE_IMAGES_DELETE: (filename) => `${API_BASE_URL}/api/people-images/${filename}`,
};

export default API_BASE_URL;
