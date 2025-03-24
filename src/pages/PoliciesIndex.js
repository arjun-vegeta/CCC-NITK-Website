import React from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

function PoliciesIndex() {
  // Use webpack's require.context to load .mdx files dynamically
  const modules = require.context('../content/policies', false, /\.mdx$/);

  const posts = modules.keys().map((path) => {
    const slug = path.split('/').pop().replace('.mdx', '');
    const module = modules(path);
    const title = module.frontmatter?.title || slug;
    return { slug, title, href: `/policies/${slug}` };
  });

  return (
    <Layout sidebar={<Sidebar links={posts} />}>
      <h1 className="text-3xl font-bold mb-4">Policies</h1>
      <p>Please select a policy page from the sidebar.</p>
    </Layout>
  );
}

export default PoliciesIndex;
