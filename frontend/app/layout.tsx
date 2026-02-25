import type { Metadata } from 'next'
import './globals.css'
import { CommandMenu } from '@/components/CommandMenu'

export const metadata: Metadata = {
  title: 'Utils Helper - Developer Tools',
  description: 'A comprehensive suite of developer tools including JSON/YAML/TOML processors, diff tools, and API utilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CommandMenu />
        {children}
      </body>
    </html>
  )
}
