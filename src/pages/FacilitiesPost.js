import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from '../mdxComponents';
import { extractHeadingsFromElement } from "../components/ExtractHeadings";


function FacilitiesPost() {
  const { '*': slugPath } = useParams();
  const modules = require.context('../content/facilities', true, /\.mdx$/);
  const posts = [];

  modules.keys().forEach((path) => {
    const parts = path.replace('./', '').split('/');
    const fileSlug = parts.pop().replace('.mdx', '');
    const module = modules(path);
    const title = module.frontmatter?.title || fileSlug;

    let currentLevel = posts;
    let currentPath = "/facilities";

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

    const href = `${currentPath}/${fileSlug}`;
    currentLevel.push({ title, slug: fileSlug, href });
  });

  // console.log(posts);
  // console.log("All available MDX files:", modules.keys());
  // console.log("Requested slugPath:", slugPath);

  const normalizePath = (path) => {
    const parts = path.replace('./', '').replace('.mdx', '').split('/');

    for (let i = 0; i < parts.length - 1; i++) {
      parts[i] = parts[i].toLowerCase().replace(/\s+/g, '_');
    }

    return parts.join('/');
  };

  const postKey = modules.keys().find((path) => {
    const normalizedPath = normalizePath(path);
    // console.log(`Checking: ${normalizedPath} === ${slugPath}`);
    return normalizedPath === slugPath;
  });

  // Extract headings dynamically
  const contentRef = useRef(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    setHeadings(extractHeadingsFromElement(contentRef.current));
  }, [postKey]);

  if (!postKey) {
    return (
      <FullWidthLayout sidebar={<Sidebar links={posts} />} headings={[]}>
        <div>Post not found</div>
      </FullWidthLayout>
    );
  }

  const PostComponent = modules(postKey).default;

  return (
    <FullWidthLayout sidebar={<Sidebar links={posts} />} headings={headings}>
      <div className="w-full" ref={contentRef}>
        <MDXProvider components={mdxComponents}>
          <PostComponent />
        </MDXProvider>
      </div>
    </FullWidthLayout>
  );
}

export default FacilitiesPost;
