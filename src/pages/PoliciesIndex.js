import React from 'react';
import FullWidthLayout from '../components/FullWidthLayout';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function PoliciesIndex() {
  const modules = require.context('../content/policies', false, /\.mdx$/);
  const posts = [];
  const flatPosts = [];

  modules.keys().forEach((path) => {
    const slug = path.split('/').pop().replace('.mdx', '');
    const module = modules(path);
    const title = module.frontmatter?.title || slug;
    const content = module.default?.toString().slice(0, 150) + '...';
    const href = `/policies/${slug}`;
    const post = { slug, title, href, content };
    posts.push(post);
    flatPosts.push(post);
  });

  return (
    <FullWidthLayout sidebar={<Sidebar links={posts} />}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
            Usage Policies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Important guidelines and policies for using CCC facilities and services at NITK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flatPosts.map((post) => (
                    <Link 
                      key={post.slug}
                      to={post.href}
                      className="group relative overflow-hidden rounded-lg border-2 px-5 hover:border-black transition-colors bg-white hover:shadow-lg no-underline"
                    >
                      <div className="flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors no-underline">
                          {post.title}
                        </h3>
                        <div className="mt-auto flex items-center justify-between pb-7">
                          <span className="text-sm text-gray-500 no-underline">View Policy</span>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
      </div>
    </FullWidthLayout>
  );
}

export default PoliciesIndex;
