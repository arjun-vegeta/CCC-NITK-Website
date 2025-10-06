import React, { useState, useEffect } from 'react';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDarkMode } from '../utils/DarkModeContext';

function FacilitiesIndex() {
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [flatPosts, setFlatPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mdx/public/facilities`);
        const data = await response.json();
        
        const fileList = data.files.map(file => ({
          title: file.title,
          slug: file.filename.replace('.mdx', ''),
          href: `/facilities/${file.filename.replace('.mdx', '')}`
        }));
        
        setPosts(fileList);
        setFlatPosts(fileList);
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <FullWidthLayout sidebar={<Sidebar links={posts} />}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </FullWidthLayout>
    );
  }

  return (
    <FullWidthLayout sidebar={<Sidebar links={posts} />}>
      <div className="px-2 pb-6">
        <div>
          <h1 className={`text-4xl font-bold mb-4 ${
            darkMode 
              ? "text-white" 
              : "bg-gradient-to-r from-black to-black text-transparent bg-clip-text"
          }`}>
            Facilities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explore our state-of-the-art computing facilities and infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {flatPosts.map((post) => (
            <Link 
              key={post.slug}
              to={post.href}
              className="group relative overflow-hidden rounded-lg border-2 px-5 hover:border-black dark:hover:border-white transition-colors bg-[#f5f5f5] dark:bg-[#0b0c10] hover:shadow-lg dark:hover:shadow-gray-900 no-underline dark-transition"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors no-underline">
                  {post.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pb-8">
                  <span className="text-sm text-gray-500 dark:text-gray-400 no-underline">Learn more</span>
                  <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </FullWidthLayout>
  );
}

export default FacilitiesIndex;
