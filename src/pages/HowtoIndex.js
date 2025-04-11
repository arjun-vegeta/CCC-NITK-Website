import React from 'react';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function HowtoIndexPage() {
  const modules = require.context('../content/howto', true, /\.mdx$/);
  const posts = [];
  const flatPosts = [];
  
  modules.keys().forEach((path) => {
    const parts = path.replace('./', '').split('/');
    const slug = parts.pop().replace('.mdx', '');
    const module = modules(path);
    const title = module.frontmatter?.title || slug;
    const content = module.default?.toString().slice(0, 150) + '...';
  
    let currentLevel = posts;
    let currentPath = "/howto";
  
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
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">How To Guides</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            A collection of guides to help you make the most of our computing facilities and services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flatPosts.map((post) => (
            <Link 
              key={post.slug}
              to={post.href}
              className="group relative overflow-hidden rounded-lg border p-5 hover:border-blue-600 transition-colors bg-white hover:shadow-lg"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-500">Read guide</span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </FullWidthLayout>
  );
}

export default HowtoIndexPage;