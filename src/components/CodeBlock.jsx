// src/components/CodeBlock.jsx
'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'

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
        title="Copy"
      >
        <Copy className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}
