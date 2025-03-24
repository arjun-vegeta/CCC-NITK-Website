import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 container mx-auto p-4">        
        {sidebar && <aside className="w-64 mr-4">{sidebar}</aside>}
        <main className="flex-1 max-w-3xl">
          <article className="prose 
            prose-lg 
            dark:prose-invert 
            prose-headings:font-semibold
            prose-a:no-underline
            prose-code:before:content-['']
            prose-code:after:content-['']
            prose-pre:bg-gray-50
            dark:prose-pre:bg-gray-800
            prose-img:rounded-xl
            prose-blockquote:border-l-4
            prose-blockquote:not-italic
            prose-table:border-collapse
            prose-td:border
            prose-th:border
            lg:prose-xl">
            {children}
          </article>
        </main>
      </div>
      <footer className="bg-gray-800 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Computer Center. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
