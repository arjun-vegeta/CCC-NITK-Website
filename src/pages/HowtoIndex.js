import React from 'react';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';

function HowtoIndexPage() {

  const modules = require.context('../content/howto', true, /\.mdx$/);
  const posts = [];
  
  modules.keys().forEach((path) => {
    const parts = path.replace('./', '').split('/'); // Remove './' and split by folder
    const slug = parts.pop().replace('.mdx', ''); // Extract file name
    const module = modules(path);
    const title = module.frontmatter?.title || slug;
  
    let currentLevel = posts;
    let currentPath = "/howto";
  
    parts.forEach((part) => {
      const folderSlug = part.toLowerCase().replace(/\s+/g, '_'); // Replace spaces with '_'
      currentPath += `/${folderSlug}`;
  
      let existing = currentLevel.find((item) => item.slug === folderSlug);
      if (!existing) {
        existing = { title: part, slug: folderSlug, children: [] };
        currentLevel.push(existing);
      }
      currentLevel = existing.children;
    });
  
    const href = `${currentPath}/${slug}`;
    currentLevel.push({ title, slug, href });
  });
  
  console.log(posts);

  return (
    <FullWidthLayout sidebar={<Sidebar links={posts} />}>
      <h1 className="text-3xl font-bold mb-4">How To Guides</h1>
      <p>Please select a guide from the sidebar.</p>
    </FullWidthLayout>
  );
}

export default HowtoIndexPage;