'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative my-4">
      <pre className="bg-gray-900 text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words text-sm font-mono">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        className={`absolute top-2 right-2 p-1 rounded-md transition-colors ${
          copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600 focus:bg-gray-600'
        }`}
      >
        {copied ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <Copy className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  )
}
