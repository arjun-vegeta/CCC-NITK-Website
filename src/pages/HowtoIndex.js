import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SidebarMain from '../components/Sidebar';

function HowtoIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">How To Guides</h1>
      <p>Please select a guide from the sidebar.</p>
    </div>
  );
}

export default function HowtoIndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Load the list of posts
    const context = require.context('../content/howto', false, /\.mdx?$/);
    const postsData = context.keys().map((path) => {
      const slug = path.split('/').pop().replace(/\.mdx?$/, '');
      return { 
        slug, 
        title: slug.replace(/-/g, ' '), 
        href: `/howto/${slug}` 
      };
    });
    setPosts(postsData);
  }, []);

  return (
    <Layout sidebar={<SidebarMain links={posts} />}>
      <HowtoIndex />
    </Layout>
  );
}