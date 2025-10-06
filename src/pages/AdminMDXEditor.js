import React, { useState, useRef, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { mdxComponents } from '../mdxComponents';
import { extractHeadingsFromElement } from '../components/ExtractHeadings';
import { 
  Download, 
  Copy, 
  FileText, 
  Eye, 
  Code, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus
} from 'lucide-react';
import ModalImage from '../components/ui/ModalImage';
import ZoomableImage from '../components/ui/ZoomableImage';
import CodeBlock from '../components/ui/CodeBlock';
import CopyButton from '../components/ui/CopyButton';
import NoteBox from '../components/ui/NoteBox';
import Table, { Thead, Tbody, Tr, Th, Td } from '../components/ui/tables';
import Button from '../components/ui/button';

function AdminMDXEditor() {
  const [mdxCode, setMdxCode] = useState(`# Welcome to MDX Editor

This is a **live** MDX editor. Edit the code on the left and see the preview on the right.

## Features

- Real-time preview
- Full MDX support
- Same styling as your guides
- Custom components (ModalImage, ZoomableImage)
- Download as .mdx file
- Copy to clipboard

### Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Custom Components

You can use custom components without importing them:

<ZoomableImage
  src="/images_mdx/example.png"
  alt="Example Image"
/>

<ModalImage
  src="/images_mdx/example.png"
  alt="Modal Example"
  width="400px"
  height="300px"
/>

<NoteBox>
This is a note box with important information!
</NoteBox>

<CodeBlock>
npm install react
</CodeBlock>

<Button href="https://example.com">
Click Me
</Button>

### Lists

1. First item
2. Second item
3. Third item

**Unordered:**
- Item 1
- Item 2
- Item 3

### Links

Check out [React](https://react.dev) for more info.

> This is a blockquote with some important information.

### Table Example

| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Export | ✅ |
| Custom Components | ✅ |
`);
  
  const [MDXContent, setMDXContent] = useState(null);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('document.mdx');
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const contentRef = useRef(null);
  const textareaRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const compileMDX = async () => {
      try {
        setError(null);
        
        let processedCode = mdxCode;
        
        // Remove frontmatter export (causes issues in runtime compilation)
        const frontmatterRegex = /export\s+const\s+frontmatter\s*=\s*\{[^}]*\};?\s*/g;
        processedCode = processedCode.replace(frontmatterRegex, '');
        
        // Remove import statements (components are provided globally)
        const importRegex = /import\s+.*\s+from\s+['"].*['"];?\s*/g;
        processedCode = processedCode.replace(importRegex, '');
        
        const { default: Content } = await evaluate(processedCode, {
          ...runtime,
          development: false,
          // Provide all components globally so they don't need to be imported
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
        console.error('MDX compilation error:', err);
      }
    };

    const debounce = setTimeout(compileMDX, 500);
    return () => clearTimeout(debounce);
  }, [mdxCode]);

  useEffect(() => {
    if (contentRef.current && MDXContent) {
      setTimeout(() => {
        setHeadings(extractHeadingsFromElement(contentRef.current));
      }, 100);
    }
  }, [MDXContent]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showComponentMenu && !event.target.closest('.component-menu-container')) {
        setShowComponentMenu(false);
      }
      if (showBlockMenu && !event.target.closest('.block-menu-container')) {
        setShowBlockMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showComponentMenu, showBlockMenu]);

  // Keyboard shortcuts for formatting and menus
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Component menu: Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowComponentMenu(prev => !prev);
      }
      
      // Bold: Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        formatBold();
      }
      
      // Italic: Ctrl/Cmd + I
      if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
        event.preventDefault();
        formatItalic();
      }
      
      // Escape to close menus
      if (event.key === 'Escape') {
        if (showComponentMenu) setShowComponentMenu(false);
        if (showBlockMenu) setShowBlockMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showComponentMenu, showBlockMenu]);

  const handleDownload = () => {
    const blob = new Blob([mdxCode], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mdxCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setMdxCode(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const componentTemplates = {
    ModalImage: {
      import: 'import ModalImage from "../../components/ui/ModalImage";',
      code: `<ModalImage
  src="/images_mdx/example.png"
  alt="Description"
  width="600px"
  height="400px"
/>`
    },
    ZoomableImage: {
      import: 'import ZoomableImage from "../../components/ui/ZoomableImage";',
      code: `<ZoomableImage
  src="/images_mdx/example.png"
  alt="Description"
/>`
    },
    CodeBlock: {
      import: 'import CodeBlock from "../../components/ui/CodeBlock";',
      code: `<CodeBlock>
npm install react
npm start
</CodeBlock>`
    },
    CopyButton: {
      import: 'import CopyButton from "../../components/ui/CopyButton";',
      code: `<CopyButton code="npm install react" />`
    },
    NoteBox: {
      import: 'import NoteBox from "../../components/ui/NoteBox";',
      code: `<NoteBox>
This is an important note or information box.
</NoteBox>`
    },
    Table: {
      import: 'import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/ui/tables";',
      code: `<Table>
  <Thead>
    <Tr>
      <Th>Header 1</Th>
      <Th>Header 2</Th>
      <Th>Header 3</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Data 1</Td>
      <Td>Data 2</Td>
      <Td>Data 3</Td>
    </Tr>
    <Tr>
      <Td>Data 4</Td>
      <Td>Data 5</Td>
      <Td>Data 6</Td>
    </Tr>
  </Tbody>
</Table>`
    },
    Button: {
      import: 'import Button from "../../components/ui/button";',
      code: `<Button href="https://example.com">
Click Me
</Button>`
    },
  };

  const insertComponent = (componentName) => {
    const template = componentTemplates[componentName];
    if (!template) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBefore = mdxCode.substring(0, cursorPos);
    const textAfter = mdxCode.substring(cursorPos);

    // Check if import already exists
    const hasImport = mdxCode.includes(template.import);
    
    // Add import at the top if it doesn't exist
    let newImport = '';
    if (!hasImport) {
      // Find where to insert import (after frontmatter if exists, or at top)
      const frontmatterMatch = mdxCode.match(/export\s+const\s+frontmatter\s*=\s*\{[^}]*\};?\s*/);
      if (frontmatterMatch) {
        const frontmatterEnd = frontmatterMatch.index + frontmatterMatch[0].length;
        const beforeFrontmatter = mdxCode.substring(0, frontmatterEnd);
        const afterFrontmatter = mdxCode.substring(frontmatterEnd);
        newImport = `${beforeFrontmatter}${template.import}\n${afterFrontmatter}`;
      } else {
        newImport = `${template.import}\n\n${mdxCode}`;
      }
    }

    // Insert component code at cursor position
    const finalCode = hasImport 
      ? `${textBefore}\n${template.code}\n${textAfter}`
      : newImport.substring(0, cursorPos + template.import.length + 2) + 
        `\n${template.code}\n` + 
        newImport.substring(cursorPos + template.import.length + 2);

    setMdxCode(finalCode);
    setShowComponentMenu(false);

    // Focus back on textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = hasImport 
        ? cursorPos + template.code.length + 2
        : cursorPos + template.import.length + template.code.length + 4;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Formatting functions
  const wrapSelection = (before, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = mdxCode.substring(start, end);
    const textBefore = mdxCode.substring(0, start);
    const textAfter = mdxCode.substring(end);

    const newText = `${textBefore}${before}${selectedText}${after}${textAfter}`;
    setMdxCode(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const textBefore = mdxCode.substring(0, start);
    const textAfter = mdxCode.substring(start);

    const newText = `${textBefore}${text}${textAfter}`;
    setMdxCode(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Find the start of the current line
    const textBefore = mdxCode.substring(0, start);
    const lastNewline = textBefore.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    
    const currentLine = mdxCode.substring(lineStart, end);
    const textAfter = mdxCode.substring(end);
    const beforeLine = mdxCode.substring(0, lineStart);

    const newText = `${beforeLine}${prefix}${currentLine}${textAfter}`;
    setMdxCode(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    }, 0);
  };

  const formatBold = () => wrapSelection('**');
  const formatItalic = () => wrapSelection('*');
  const formatUnderline = () => wrapSelection('<u>', '</u>');
  const formatHeading1 = () => insertLinePrefix('# ');
  const formatHeading2 = () => insertLinePrefix('## ');
  const formatHeading3 = () => insertLinePrefix('### ');
  const formatBulletList = () => insertLinePrefix('- ');
  const formatNumberedList = () => insertLinePrefix('1. ');
  const formatQuote = () => insertLinePrefix('> ');
  const formatHorizontalRule = () => insertAtCursor('\n---\n');
  
  const formatLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = mdxCode.substring(start, end);
    
    if (selectedText) {
      wrapSelection('[', '](https://example.com)');
    } else {
      insertAtCursor('[Link Text](https://example.com)');
    }
  };

  const formatImage = () => {
    insertAtCursor('![Alt Text](/images_mdx/example.png)');
  };

  const formatCodeBlock = () => {
    insertAtCursor('\n```javascript\n// Your code here\n```\n');
  };

  // Undo/Redo functionality
  const saveToHistory = (newCode) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    if (newHistory.length > 50) newHistory.shift(); // Keep last 50 states
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMdxCode(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMdxCode(history[historyIndex + 1]);
    }
  };

  // Save to history when code changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mdxCode && (history.length === 0 || mdxCode !== history[historyIndex])) {
        saveToHistory(mdxCode);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [mdxCode]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0b0c10]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-6 w-6" />
                MDX Editor
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Edit MDX code and preview in real-time</p>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="filename.mdx"
              />

              {/* Component Selector Dropdown */}
              <div className="relative component-menu-container">
                <button
                  onClick={() => setShowComponentMenu(!showComponentMenu)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  Insert Component
                </button>
                
                {showComponentMenu && (
                  <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Select Component
                      </div>
                      {Object.keys(componentTemplates).map((componentName) => (
                        <button
                          key={componentName}
                          onClick={() => insertComponent(componentName)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group"
                        >
                          <span>{componentName}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            Insert
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <label className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept=".mdx,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Open File
              </label>

              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400">
            <span>Lines: {mdxCode.split('\n').length}</span>
            <span>Characters: {mdxCode.length}</span>
            <span>Words: {mdxCode.split(/\s+/).filter(w => w).length}</span>
            {headings.length > 0 && <span>Headings: {headings.length}</span>}
            {error ? (
              <span className="text-red-600 dark:text-red-400 font-medium">⚠ Compilation Error</span>
            ) : (
              <span className="text-green-600 dark:text-green-400 font-medium">✓ Valid MDX</span>
            )}
          </div>
          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-4 flex-wrap">
            <span>💡 Shortcuts:</span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+B</kbd> Bold</span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+I</kbd> Italic</span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+K</kbd> Components</span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Z</kbd> Undo</span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Y</kbd> Redo</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-145px)]">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700 flex items-center gap-2">
            <Code className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Editor</span>
          </div>

          {/* Formatting Toolbar */}
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 px-2 py-2 flex items-center gap-1 flex-wrap">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Block Type Selector */}
            <div className="relative block-menu-container">
              <button
                onClick={() => setShowBlockMenu(!showBlockMenu)}
                className="px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Block Type"
              >
                Block Type ▾
              </button>
              
              {showBlockMenu && (
                <div className="absolute top-full mt-1 left-0 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button onClick={formatHeading1} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Heading1 className="h-4 w-4" /> Heading 1
                    </button>
                    <button onClick={formatHeading2} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Heading2 className="h-4 w-4" /> Heading 2
                    </button>
                    <button onClick={formatHeading3} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Heading3 className="h-4 w-4" /> Heading 3
                    </button>
                    <button onClick={formatQuote} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Quote className="h-4 w-4" /> Quote
                    </button>
                    <button onClick={formatCodeBlock} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Code Block
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Text Formatting */}
            <div className="flex items-center gap-1 px-2 border-l border-gray-300 dark:border-gray-600">
              <button
                onClick={formatBold}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={formatItalic}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={formatUnderline}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Underline"
              >
                <Underline className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 px-2 border-l border-gray-300 dark:border-gray-600">
              <button
                onClick={formatBulletList}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Bullet List"
              >
                <List className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={formatNumberedList}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Insert */}
            <div className="flex items-center gap-1 px-2 border-l border-gray-300 dark:border-gray-600">
              <button
                onClick={formatLink}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={formatImage}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={formatHorizontalRule}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Horizontal Rule"
              >
                <Minus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={mdxCode}
            onChange={(e) => setMdxCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none leading-relaxed"
            spellCheck="false"
            style={{ tabSize: 2 }}
          />
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-300 dark:border-red-700 p-4 max-h-32 overflow-y-auto">
              <p className="text-sm font-medium text-red-800 dark:text-red-400">Compilation Error:</p>
              <pre className="text-xs text-red-600 dark:text-red-300 mt-2 whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 overflow-y-auto bg-[#f5f5f5] dark:bg-[#0b0c10]">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-10 flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
          </div>
          <div className="p-6 md:p-12">
            <div ref={contentRef} className="prose dark:prose-invert max-w-none">
              {MDXContent && !error && (
                <MDXProvider 
                  components={{
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
                  }}
                >
                  <MDXContent />
                </MDXProvider>
              )}
              {!MDXContent && !error && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start typing to see the preview...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMDXEditor;
