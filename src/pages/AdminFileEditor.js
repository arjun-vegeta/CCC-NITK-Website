import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code as CodeIcon, Quote, Heading1, Heading2, Heading3, Minus, Undo, Redo, Upload } from 'lucide-react';
import { MDXProvider } from '@mdx-js/react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { mdxComponents } from '../mdxComponents';
import ModalImage from '../components/ui/ModalImage';
import ZoomableImage from '../components/ui/ZoomableImage';
import CodeBlock from '../components/ui/CodeBlock';
import CopyButton from '../components/ui/CopyButton';
import NoteBox from '../components/ui/NoteBox';
import Table, { Thead, Tbody, Tr, Th, Td } from '../components/ui/tables';
import Button from '../components/ui/button';

function AdminFileEditor() {
  const { category, filename } = useParams();
  const [mdxCode, setMdxCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [MDXContent, setMDXContent] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const contentRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const isNewFile = filename === 'new';
  const [newFilename, setNewFilename] = useState('');
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const componentTemplates = {
    ModalImage: `<ModalImage src="/images/example.png" alt="Description" />`,
    ZoomableImage: `<ZoomableImage src="/images/example.png" alt="Description" />`,
    CodeBlock: `<CodeBlock language="javascript">\n{\`const example = "code";\`}\n</CodeBlock>`,
    NoteBox: `<NoteBox type="info">\nYour note here\n</NoteBox>`,
    Table: `<Table>\n  <Thead>\n    <Tr><Th>Header 1</Th><Th>Header 2</Th></Tr>\n  </Thead>\n  <Tbody>\n    <Tr><Td>Data 1</Td><Td>Data 2</Td></Tr>\n  </Tbody>\n</Table>`,
    Button: `<Button>Click me</Button>`,
  };

  useEffect(() => {
    if (!isNewFile) {
      fetchFile();
    } else {
      setMdxCode(`export const frontmatter = { title: "New Document" };

# New Document

Start writing your content here...
`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, filename]);

  useEffect(() => {
    setHasChanges(mdxCode !== originalCode);
  }, [mdxCode, originalCode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.block-menu-container')) setShowBlockMenu(false);
      if (!e.target.closest('.component-menu-container')) setShowComponentMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        formatBold();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        formatItalic();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowComponentMenu(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Escape') {
        setShowBlockMenu(false);
        setShowComponentMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, historyIndex]);

  const addToHistory = (newCode) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
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

  const wrapSelection = (before, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = mdxCode.substring(start, end);
    const newText = mdxCode.substring(0, start) + before + selectedText + after + mdxCode.substring(end);
    addToHistory(newText);
    setMdxCode(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatBold = () => wrapSelection('**');
  const formatItalic = () => wrapSelection('*');
  const formatUnderline = () => wrapSelection('<u>', '</u>');
  const formatLink = () => wrapSelection('[', '](url)');
  const formatImage = () => {
    setShowImagePicker(true);
    fetchAvailableImages();
  };

  const fetchAvailableImages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const images = await response.json();
        setAvailableImages(images);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  const insertImageUrl = (imageUrl) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const template = `<ZoomableImage src="${imageUrl}" alt="Description" width="600px" />`;
    const newText = mdxCode.substring(0, start) + '\n' + template + '\n' + mdxCode.substring(start);
    addToHistory(newText);
    setMdxCode(newText);
    setShowImagePicker(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length + 2, start + template.length + 2);
    }, 0);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert(`Image is too large! Maximum size is 5MB.\nYour image: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      e.target.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type! Please upload an image file (JPG, PNG, GIF, SVG, or WebP).');
      e.target.value = '';
      return;
    }

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/images/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      await fetchAvailableImages();
      insertImageUrl(data.url);
    } catch (err) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const formatLineStart = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const lineStart = mdxCode.lastIndexOf('\n', start - 1) + 1;
    const newText = mdxCode.substring(0, lineStart) + prefix + mdxCode.substring(lineStart);
    addToHistory(newText);
    setMdxCode(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const formatHeading1 = () => { formatLineStart('# '); setShowBlockMenu(false); };
  const formatHeading2 = () => { formatLineStart('## '); setShowBlockMenu(false); };
  const formatHeading3 = () => { formatLineStart('### '); setShowBlockMenu(false); };
  const formatQuote = () => { formatLineStart('> '); setShowBlockMenu(false); };
  const formatBulletList = () => formatLineStart('- ');
  const formatNumberedList = () => formatLineStart('1. ');
  const formatCodeBlock = () => { wrapSelection('```\n', '\n```'); setShowBlockMenu(false); };
  const formatHorizontalRule = () => formatLineStart('\n---\n');

  const insertComponent = (componentName) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const template = componentTemplates[componentName];
    const start = textarea.selectionStart;
    const newText = mdxCode.substring(0, start) + '\n' + template + '\n' + mdxCode.substring(start);
    addToHistory(newText);
    setMdxCode(newText);
    setShowComponentMenu(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length + 2, start + template.length + 2);
    }, 0);
  };

  const fetchFile = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/mdx/${category}/${filename}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch file');

      const data = await response.json();
      setMdxCode(data.content);
      setOriginalCode(data.content);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const compileMDX = async () => {
      try {
        setError(null);
        let processedCode = mdxCode;

        const frontmatterRegex = /export\s+const\s+frontmatter\s*=\s*\{[^}]*\};?\s*/g;
        processedCode = processedCode.replace(frontmatterRegex, '');

        const importRegex = /import\s+.*\s+from\s+['"].*['"];?\s*/g;
        processedCode = processedCode.replace(importRegex, '');

        const { default: Content } = await evaluate(processedCode, {
          ...runtime,
          development: false,
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
      }
    };

    const debounce = setTimeout(compileMDX, 500);
    return () => clearTimeout(debounce);
  }, [mdxCode]);

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    setSaving(true);

    try {
      if (isNewFile) {
        if (!newFilename) {
          alert('Please enter a filename');
          setSaving(false);
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/mdx/${category}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: newFilename,
              content: mdxCode
            })
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create file');
        }

        navigate(`/admin/content/${category}`);
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/mdx/${category}/${filename}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: mdxCode })
          }
        );

        if (!response.ok) throw new Error('Failed to save file');

        setOriginalCode(mdxCode);
        alert('File saved successfully!');
      }
    } catch (err) {
      alert('Error saving file: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    navigate(`/admin/content/${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isNewFile ? 'New File' : filename}
                </h1>
                {hasChanges && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">Unsaved changes</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || (!hasChanges && !isNewFile)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {isNewFile && (
            <div className="mt-4">
              <input
                type="text"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                placeholder="Enter filename (e.g., my-guide.mdx)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex h-[calc(100vh-120px)]">
        <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 flex flex-col">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
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
                      <CodeIcon className="h-4 w-4" /> Code Block
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
            {/* Component Selector */}
            <div className="relative component-menu-container border-l border-gray-300 dark:border-gray-600 pl-2">
              <button
                onClick={() => setShowComponentMenu(!showComponentMenu)}
                className="px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Insert Component (Ctrl+K)"
              >
                Components ▾
              </button>
              {showComponentMenu && (
                <div className="absolute top-full mt-1 right-0 w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
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
          </div>

          {/* Image Picker Modal */}
          {showImagePicker && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select or Upload Image</h3>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer text-sm">
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload New'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => setShowImagePicker(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {availableImages.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No images uploaded yet</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {uploadingImage ? 'Uploading...' : 'Upload Your First Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {availableImages.map((image) => (
                        <button
                          key={image.name}
                          onClick={() => insertImageUrl(image.url)}
                          className="group relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                              Insert
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={mdxCode}
            onChange={(e) => setMdxCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none"
            spellCheck="false"
          />
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-300 dark:border-red-700 p-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-400">Error:</p>
              <pre className="text-xs text-red-600 dark:text-red-300 mt-2 whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </div>

        <div className="w-1/2 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700 sticky top-0">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
          </div>
          <div className="p-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFileEditor;
