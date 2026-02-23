'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const tools = [
    { name: 'JSON Tools', href: '/json', keywords: ['json', 'format', 'validate'] },
    { name: 'YAML Tools', href: '/yaml', keywords: ['yaml', 'yml'] },
    { name: 'TOML Tools', href: '/toml', keywords: ['toml', 'config'] },
    { name: 'Diff Tool', href: '/diff', keywords: ['diff', 'compare', 'difference'] },
    { name: 'Converter', href: '/converter', keywords: ['convert', 'transform', 'go', 'rust'] },
    { name: 'IP Address', href: '/ip', keywords: ['ip', 'address', 'location'] },
    { name: 'Holiday Query', href: '/holiday', keywords: ['holiday', 'vacation', 'chinese'] },
  ]

  const filteredTools = search
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(search.toLowerCase()) ||
          tool.keywords.some((k) => k.includes(search.toLowerCase()))
      )
    : tools

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (href: string) => {
    setOpen(false)
    setSearch('')
    router.push(href)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
      <div
        className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full bg-transparent outline-none text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredTools.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No tools found</div>
            ) : (
              filteredTools.map((tool) => (
                <button
                  key={tool.name}
                  className="w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onClick={() => handleSelect(tool.href)}
                >
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm text-gray-500">{tool.href}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
