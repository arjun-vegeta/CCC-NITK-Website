import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "../mdxComponents";

function HowtoPost() {
  const { slug } = useParams();
  const [PostContent, setPostContent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load sidebar posts
    const sidebarContext = require.context("../content/howto", false, /\.mdx$/);
    const sidebarPosts = sidebarContext.keys().map(path => ({
      slug: path.match(/\.\/(.*)\.mdx/)[1],
      title: path.match(/\.\/(.*)\.mdx/)[1].replace(/-/g, ' '),
      href: `/howto/${path.match(/\.\/(.*)\.mdx/)[1]}`
    }));
    setPosts(sidebarPosts);

    // Load main post content
    const postContext = require.context("../content/howto", false, /\.mdx$/);
    try {
      const postPath = postContext.keys().find(key => key === `./${slug}.mdx`);
      if (!postPath) throw new Error("Post not found");
      const content = postContext(postPath).default;
      setPostContent(() => content);
    } catch (error) {
      console.error("Error loading post:", error);
      setPostContent(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!PostContent) return <div>Post not found</div>;

  return (
    <Layout sidebar={<Sidebar links={posts} />}>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXProvider components={mdxComponents}>
          <PostContent />
        </MDXProvider>
      </div>
    </Layout>
  );
}

export default HowtoPost;