'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative my-4">
      <pre className="bg-[#1e1e1e] text-white p-4 rounded-md overflow-x-auto text-sm font-mono">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700 transition"
        title={copied ? 'Copied' : 'Copy'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-white transition-opacity duration-300" />
        ) : (
          <Copy className="w-4 h-4 text-white transition-opacity duration-300" />
        )}
      </button>
    </div>
  )
}
