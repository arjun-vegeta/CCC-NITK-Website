import React from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

function FacilitiesIndex() {

  const modules = require.context('../content/facilities', true, /\.mdx$/);
  const posts = [];
  
  modules.keys().forEach((path) => {
    const parts = path.replace('./', '').split('/'); // Remove './' and split by folder
    const slug = parts.pop().replace('.mdx', ''); // Extract file name
    const module = modules(path);
    const title = module.frontmatter?.title || slug;
  
    let currentLevel = posts;
    let currentPath = "/facilities";
  
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
    <Layout sidebar={<Sidebar links={posts} />}>
      <h1 className="text-3xl font-bold mb-4">Facilities</h1>
      <p>Please select a facility page from the sidebar.</p>
    </Layout>
  );
}

export default FacilitiesIndex;
