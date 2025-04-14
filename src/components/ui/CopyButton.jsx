// src/components/CopyButton.jsx
'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'

export default function CopyButton({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Copy className="w-4 h-4" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
