import React from "react";

const Layout = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex space-between p-4">        
        {sidebar && <aside className="w-[25%] mr-4">{sidebar}</aside>}
        <main className="flex w-[75%]">
          <article className="w-full prose 
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
    </div>
  );
};

export default Layout;
