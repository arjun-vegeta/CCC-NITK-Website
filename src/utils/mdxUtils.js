import removeMarkdown from 'remove-markdown';

export const getMdxContent = async () => {
  const req = require.context("../content", true, /\.mdx$/);
  const files = req.keys();
  
  const items = await Promise.all(files.map(async (filePath) => {
    const path = filePath
      .replace(/^.\//, '')
      .replace(/\.mdx$/, '')
      .split('/')
      .filter(p => p !== 'content')
      .join('/');

    const title = path
      .split('/')
      .pop()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const content = await import(`!!raw-loader!../content/${path}.mdx`);
    const cleanContent = removeMarkdown(content.default);
    
    return {
      title,
      path: `/${path}`,
      content: content.default,
      cleanContent
    };
  }));
  
  return items;
};

export const searchContent = (items, query) => {
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) || 
    item.cleanContent.toLowerCase().includes(lowerQuery)
  );
};