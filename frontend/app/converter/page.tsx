'use client'

import { useState } from 'react'
import * as yaml from 'js-yaml'
import * as TOML from '@iarna/toml'

export default function ConverterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [fromFormat, setFromFormat] = useState<'json' | 'yaml' | 'toml'>('json')
  const [toFormat, setToFormat] = useState<'json' | 'yaml' | 'toml' | 'go' | 'rust'>('yaml')
  const [error, setError] = useState('')

  const convert = () => {
    setError('')
    try {
      let parsed: any

      // Parse input
      if (fromFormat === 'json') {
        parsed = JSON.parse(input)
      } else if (fromFormat === 'yaml') {
        parsed = yaml.load(input)
      } else if (fromFormat === 'toml') {
        parsed = TOML.parse(input)
      }

      // Convert to output format
      if (toFormat === 'json') {
        setOutput(JSON.stringify(parsed, null, 2))
      } else if (toFormat === 'yaml') {
        setOutput(yaml.dump(parsed, { indent: 2 }))
      } else if (toFormat === 'toml') {
        setOutput(TOML.stringify(parsed as any))
      } else if (toFormat === 'go') {
        setOutput(jsonToGoStruct(parsed))
      } else if (toFormat === 'rust') {
        setOutput(jsonToRustStruct(parsed))
      }
    } catch (e) {
      setError('Conversion error: ' + (e as Error).message)
    }
  }

  const jsonToGoStruct = (obj: any, structName = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return '// Invalid input for struct generation'
    }

    let result = `type ${structName} struct {\n`

    for (const [key, value] of Object.entries(obj)) {
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
      const goType = inferGoType(value)
      result += `\t${fieldName} ${goType} \`json:"${key}"\`\n`
    }

    result += '}\n'
    return result
  }

  const inferGoType = (value: any): string => {
    if (value === null) return 'interface{}'
    if (typeof value === 'string') return 'string'
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'float64'
    }
    if (typeof value === 'boolean') return 'bool'
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]interface{}'
      return '[]' + inferGoType(value[0])
    }
    if (typeof value === 'object') return 'map[string]interface{}'
    return 'interface{}'
  }

  const jsonToRustStruct = (obj: any, structName = 'Root'): string => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return '// Invalid input for struct generation'
    }

    let result = `#[derive(Debug, Serialize, Deserialize)]\n`
    result += `struct ${structName} {\n`

    for (const [key, value] of Object.entries(obj)) {
      const rustType = inferRustType(value)
      result += `    #[serde(rename = "${key}")]\n`
      result += `    ${key}: ${rustType},\n`
    }

    result += '}\n'
    return result
  }

  const inferRustType = (value: any): string => {
    if (value === null) return 'Option<serde_json::Value>'
    if (typeof value === 'string') return 'String'
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'i64' : 'f64'
    }
    if (typeof value === 'boolean') return 'bool'
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Vec<serde_json::Value>'
      return 'Vec<' + inferRustType(value[0]) + '>'
    }
    if (typeof value === 'object') return 'serde_json::Value'
    return 'serde_json::Value'
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy'))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Format Converter</h1>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From Format</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              value={fromFormat}
              onChange={(e) => setFromFormat(e.target.value as any)}
            >
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="toml">TOML</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To Format</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              value={toFormat}
              onChange={(e) => setToFormat(e.target.value as any)}
            >
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="toml">TOML</option>
              <option value="go">Go Struct</option>
              <option value="rust">Rust Struct</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Input</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your ${fromFormat.toUpperCase()} here...`}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Output</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 font-mono text-sm"
              value={output}
              readOnly
              placeholder="Converted output will appear here..."
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={convert}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Convert
          </button>
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Copy Output
          </button>
        </div>
      </div>
    </div>
  )
}
