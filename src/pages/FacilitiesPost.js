import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';
import { MDXProvider } from '@mdx-js/react';
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from '../mdxComponents';
import { extractHeadingsFromElement } from "../components/ExtractHeadings";
import ModalImage from "../components/ui/ModalImage";
import ZoomableImage from "../components/ui/ZoomableImage";
import CodeBlock from "../components/ui/CodeBlock";
import CopyButton from "../components/ui/CopyButton";
import NoteBox from "../components/ui/NoteBox";
import Table, { Thead, Tbody, Tr, Th, Td } from "../components/ui/tables";
import Button from "../components/ui/button";

function FacilitiesPost() {
  const { '*': slugPath } = useParams();
  const filename = slugPath + '.mdx';
  const contentRef = useRef(null);
  const [headings, setHeadings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [MDXContent, setMDXContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sidebar files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mdx/public/facilities`);
        const data = await response.json();
        
        const fileList = data.files.map(file => ({
          title: file.title,
          slug: file.filename.replace('.mdx', ''),
          href: `/facilities/${file.filename.replace('.mdx', '')}`
        }));
        
        setPosts(fileList);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };
    
    fetchFiles();
  }, []);

  // Fetch and compile MDX content
  useEffect(() => {
    const fetchAndCompile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mdx/public/facilities/${filename}`);
        
        if (!response.ok) {
          throw new Error('File not found');
        }
        
        const data = await response.json();
        let mdxCode = data.content;
        
        // Remove frontmatter export (not needed for rendering)
        mdxCode = mdxCode.replace(/export\s+const\s+frontmatter\s*=\s*\{[^}]*\};?\s*/g, '');
        
        // Remove import statements (we provide components directly)
        mdxCode = mdxCode.replace(/import\s+.*\s+from\s+['"].*['"];?\s*/g, '');
        
        // Evaluate MDX with all components available
        const { default: Content } = await evaluate(mdxCode, {
          ...runtime,
          development: false,
          // Provide all components that might be used
          useMDXComponents: () => ({
            ...mdxComponents,
            ModalImage,
            ZoomableImage,
            CodeBlock,
            CopyButton,
            NoteBox,
            Table,
            Thead,
            Tbody,
            Tr,
            Th,
            Td,
            Button,
          }),
        });
        
        setMDXContent(() => Content);
      } catch (err) {
        setError(err.message);
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndCompile();
  }, [filename]);

  useEffect(() => {
    if (contentRef.current && MDXContent) {
      setTimeout(() => {
        setHeadings(extractHeadingsFromElement(contentRef.current));
      }, 100);
    }
  }, [MDXContent]);

  if (loading) {
    return (
      <FullWidthLayout sidebar={<Sidebar links={posts} />} headings={[]}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </FullWidthLayout>
    );
  }

  if (error) {
    return (
      <FullWidthLayout sidebar={<Sidebar links={posts} />} headings={[]}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </FullWidthLayout>
    );
  }

  return (
    <FullWidthLayout sidebar={<Sidebar links={posts} />} headings={headings}>
      <div className="w-full" ref={contentRef}>
        <MDXProvider components={mdxComponents}>
          <MDXContent />
        </MDXProvider>
      </div>
    </FullWidthLayout>
  );
}

export default FacilitiesPost;
