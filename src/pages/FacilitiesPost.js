import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from '../mdxComponents';

function FacilitiesPost() {
  const { '*': slugPath } = useParams(); // Capture full nested path
  const modules = require.context('../content/facilities', true, /\.mdx$/);
  const posts = [];

  modules.keys().forEach((path) => {
    const parts = path.replace('./', '').split('/'); // Remove './' and split by folder
    const fileSlug = parts.pop().replace('.mdx', ''); // Extract file name
    const module = modules(path);
    const title = module.frontmatter?.title || fileSlug;

    let currentLevel = posts;
    let currentPath = "/facilities";

    parts.forEach((part) => {
      const folderSlug = part.toLowerCase().replace(/\s+/g, '_'); // Normalize folder slug
      currentPath += `/${folderSlug}`;

      let existing = currentLevel.find((item) => item.slug === folderSlug);
      if (!existing) {
        existing = { title: part, slug: folderSlug, children: [] };
        currentLevel.push(existing);
      }
      currentLevel = existing.children;
    });

    // Store the final post entry
    const href = `${currentPath}/${fileSlug}`;
    currentLevel.push({ title, slug: fileSlug, href });
  });

  console.log(posts); // Debug to verify structure

  console.log("All available MDX files:", modules.keys());
  console.log("Requested slugPath:", slugPath);

  const normalizePath = (path) => {
    const parts = path.replace('./', '').replace('.mdx', '').split('/');
  
    // Normalize all parts except the last one (filename)
    for (let i = 0; i < parts.length - 1; i++) {
      parts[i] = parts[i].toLowerCase().replace(/\s+/g, '_');
    }
  
    return parts.join('/');
  };
  
  const postKey = modules.keys().find((path) => {
    const normalizedPath = normalizePath(path);
    console.log(`Checking: ${normalizedPath} === ${slugPath}`);
    return normalizedPath === slugPath;
  });

  if (!postKey) {
    return (
      <Layout sidebar={<Sidebar links={posts} />}>
        <div>Post not found</div>
      </Layout>
    );
  }

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

export default FacilitiesPost;
