import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from '../mdxComponents';

function PoliciesPost() {
  const { slug } = useParams();

  // Use webpack's require.context to load .mdx files dynamically
  const modules = require.context('../content/policies', false, /\.mdx$/);

  const posts = modules.keys().map((path) => {
    const fileSlug = path.split('/').pop().replace('.mdx', '');
    const module = modules(path);
    const title = module.frontmatter?.title || fileSlug;
    return { slug: fileSlug, title, href: `/policies/${fileSlug}` };
  });

  const postKey = modules.keys().find((path) =>
    path.endsWith(`${slug}.mdx`)
  );

  if (!postKey) return <div>Post not found</div>;

  const PostComponent = modules(postKey).default;

  return (
    <Layout sidebar={<Sidebar links={posts} />}>
      <div className="prose">
        <MDXProvider components={mdxComponents}>
          <PostComponent />
        </MDXProvider>
      </div>
    </Layout>
  );
}

export default PoliciesPost;
