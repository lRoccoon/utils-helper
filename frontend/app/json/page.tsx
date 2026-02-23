'use client'

import { useState } from 'react'

export default function JSONToolsPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [expandLevel, setExpandLevel] = useState(2)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerm, setFilterTerm] = useState('')

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message)
    }
  }

  const compressJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message)
    }
  }

  const escapeJSON = () => {
    setOutput(JSON.stringify(input))
  }

  const unescapeJSON = () => {
    try {
      setOutput(JSON.parse(input))
    } catch (e) {
      setError('Cannot unescape: ' + (e as Error).message)
    }
  }

  const unicodeToChinese = () => {
    try {
      const decoded = input.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      })
      setOutput(decoded)
      setError('')
    } catch (e) {
      setError('Error converting Unicode: ' + (e as Error).message)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy'))
  }

  const expandCollapse = (level: number) => {
    setExpandLevel(level)
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">JSON Tools</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Input</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Output</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono text-sm"
              value={output}
              readOnly
              placeholder="Output will appear here..."
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={formatJSON}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Format
            </button>
            <button
              onClick={compressJSON}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Compress
            </button>
            <button
              onClick={escapeJSON}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Escape
            </button>
            <button
              onClick={unescapeJSON}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Unescape
            </button>
            <button
              onClick={unicodeToChinese}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Unicode → Chinese
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Copy Output
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Expand/Collapse:</span>
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => expandCollapse(level)}
                className={`px-3 py-1 rounded ${
                  expandLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search (highlight only)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search key or value..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter (show matching only)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                placeholder="Filter key or value..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
