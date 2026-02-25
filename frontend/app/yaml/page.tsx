'use client'

import { useState } from 'react'
import * as yaml from 'js-yaml'

export default function YAMLToolsPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const formatYAML = () => {
    try {
      const parsed = yaml.load(input)
      setOutput(yaml.dump(parsed, { indent: 2 }))
      setError('')
    } catch (e) {
      setError('Invalid YAML: ' + (e as Error).message)
    }
  }

  const compressYAML = () => {
    try {
      const parsed = yaml.load(input)
      setOutput(yaml.dump(parsed, { flowLevel: 0 }))
      setError('')
    } catch (e) {
      setError('Invalid YAML: ' + (e as Error).message)
    }
  }

  const yamlToJSON = () => {
    try {
      const parsed = yaml.load(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) {
      setError('Invalid YAML: ' + (e as Error).message)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy'))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">YAML Tools</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Input</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your YAML here..."
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

        <div className="flex flex-wrap gap-2">
          <button
            onClick={formatYAML}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Format
          </button>
          <button
            onClick={compressYAML}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Compress
          </button>
          <button
            onClick={yamlToJSON}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Convert to JSON
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Copy Output
          </button>
        </div>
      </div>
    </div>
  )
}
