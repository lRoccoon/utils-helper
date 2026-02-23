import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CommandMenu } from '@/components/CommandMenu'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <CommandMenu />
        {children}
      </body>
    </html>
  )
}
