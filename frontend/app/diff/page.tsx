'use client'

import { useState } from 'react'
import { diffLines, diffJson } from 'diff'
import * as yaml from 'js-yaml'
import * as TOML from '@iarna/toml'

export default function DiffToolPage() {
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [diffType, setDiffType] = useState<'text' | 'json' | 'yaml' | 'toml'>('text')
  const [diffResult, setDiffResult] = useState<any[]>([])
  const [error, setError] = useState('')

  const performDiff = () => {
    setError('')
    try {
      if (diffType === 'text') {
        const result = diffLines(leftInput, rightInput)
        setDiffResult(result)
      } else if (diffType === 'json') {
        const left = JSON.parse(leftInput)
        const right = JSON.parse(rightInput)
        // Sort keys for consistent comparison
        const sortedLeft = JSON.parse(JSON.stringify(left, Object.keys(left).sort()))
        const sortedRight = JSON.parse(JSON.stringify(right, Object.keys(right).sort()))
        const result = diffJson(sortedLeft, sortedRight)
        setDiffResult(result)
      } else if (diffType === 'yaml') {
        const left = yaml.load(leftInput)
        const right = yaml.load(rightInput)
        // Sort and compare as JSON
        const sortedLeft = JSON.parse(JSON.stringify(left, Object.keys(left as any).sort()))
        const sortedRight = JSON.parse(JSON.stringify(right, Object.keys(right as any).sort()))
        const result = diffJson(sortedLeft, sortedRight)
        setDiffResult(result)
      } else if (diffType === 'toml') {
        const left = TOML.parse(leftInput)
        const right = TOML.parse(rightInput)
        // Sort and compare as JSON
        const sortedLeft = JSON.parse(JSON.stringify(left, Object.keys(left as any).sort()))
        const sortedRight = JSON.parse(JSON.stringify(right, Object.keys(right as any).sort()))
        const result = diffJson(sortedLeft, sortedRight)
        setDiffResult(result)
      }
    } catch (e) {
      setError('Error performing diff: ' + (e as Error).message)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Diff Tool</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Diff Type</label>
          <div className="flex gap-2">
            {(['text', 'json', 'yaml', 'toml'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDiffType(type)}
                className={`px-4 py-2 rounded transition ${
                  diffType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Left (Original)</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono text-sm"
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder="Original content..."
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Right (Modified)</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono text-sm"
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder="Modified content..."
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <button
          onClick={performDiff}
          className="mb-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Compare
        </button>

        {diffResult.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-4">
            <h2 className="text-xl font-semibold mb-4">Diff Result</h2>
            <pre className="font-mono text-sm overflow-x-auto">
              {diffResult.map((part, index) => (
                <div
                  key={index}
                  className={
                    part.added
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : part.removed
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : ''
                  }
                >
                  {part.added && '+ '}
                  {part.removed && '- '}
                  {part.value}
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
