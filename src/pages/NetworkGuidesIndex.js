import React from 'react';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDarkMode } from '../utils/DarkModeContext';

function NetworkGuidesIndex() {
  const { darkMode } = useDarkMode();
  const modules = require.context('../content/network_guides', true, /\.mdx$/);
  const posts = [];
  const flatPosts = [];
  
  modules.keys().forEach((path) => {
    const parts = path.replace('./', '').split('/');
    const slug = parts.pop().replace('.mdx', '');
    const module = modules(path);
    const title = module.frontmatter?.title || slug;
    const content = module.default?.toString().slice(0, 150) + '...';
  
    let currentLevel = posts;
    let currentPath = "/network-guides";
  
    parts.forEach((part) => {
      const folderSlug = part.toLowerCase().replace(/\s+/g, '_');
      currentPath += `/${folderSlug}`;
  
      let existing = currentLevel.find((item) => item.slug === folderSlug);
      if (!existing) {
        existing = { title: part, slug: folderSlug, children: [] };
        currentLevel.push(existing);
      }
      currentLevel = existing.children;
    });
  
    const href = `${currentPath}/${slug}`;
    const newPost = { title, slug, href, content };
    currentLevel.push(newPost);
    flatPosts.push(newPost);
  });

  return (
    <FullWidthLayout sidebar={<Sidebar links={posts} />}>
      <div className="px-2 pb-6">
        <div>
          <h1 className={`text-4xl font-bold mb-4 ${
            darkMode 
              ? "text-white" 
              : "bg-gradient-to-r from-black to-black text-transparent bg-clip-text"
          }`}>
            Guides
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            A collection of guides to help you make the most of our computing facilities and services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {flatPosts.map((post) => (
            <Link 
              key={post.slug}
              to={post.href}
              className="group relative overflow-hidden rounded-lg border-2 px-5 hover:border-black dark:hover:border-white transition-colors bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-gray-700 no-underline dark-transition"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors no-underline">
                  {post.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pb-8">
                  <span className="text-sm text-gray-500 dark:text-gray-400 no-underline">Read guide</span>
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

export default NetworkGuidesIndex;