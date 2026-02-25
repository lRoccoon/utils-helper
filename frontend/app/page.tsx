import Link from 'next/link'

export default function Home() {
  const tools = [
    { name: 'JSON Tools', href: '/json', description: 'Format, validate, and manipulate JSON data' },
    { name: 'YAML Tools', href: '/yaml', description: 'Parse and format YAML files' },
    { name: 'TOML Tools', href: '/toml', description: 'Work with TOML configuration files' },
    { name: 'Diff Tool', href: '/diff', description: 'Compare text and structured data' },
    { name: 'Converter', href: '/converter', description: 'Convert between JSON, YAML, TOML and code structs' },
    { name: 'IP Address', href: '/ip', description: 'Check your IP address and location' },
    { name: 'Holiday Query', href: '/holiday', description: 'Check Chinese legal holidays' },
  ]

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Utils Helper</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          A comprehensive suite of developer tools
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">⌘</kbd> + <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">K</kbd> to search
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
