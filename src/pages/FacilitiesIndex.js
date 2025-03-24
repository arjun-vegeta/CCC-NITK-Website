import React from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

function FacilitiesIndex() {
  // Use webpack's require.context to load .mdx files dynamically
  const modules = require.context('../content/facilities', false, /\.mdx$/);

  // Prepare a list of posts
  const posts = modules.keys().map((path) => {
    const slug = path.split('/').pop().replace('.mdx', '');
    const module = modules(path);
    const title = module.frontmatter?.title || slug;
    return { slug, title, href: `/facilities/${slug}` };
  });

  return (
    <Layout sidebar={<Sidebar links={posts} />}>
      <h1 className="text-3xl font-bold mb-4">Facilities</h1>
      <p>Please select a facility page from the sidebar.</p>
    </Layout>
  );
}

export default FacilitiesIndex;
