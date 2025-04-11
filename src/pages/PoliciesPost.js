import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from '../mdxComponents';
import { extractHeadingsFromElement } from "../components/ExtractHeadings";

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

export default PoliciesPost;
