import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getFormattedYearRange } from './utilities/date'

const inter = Inter({ subsets: ['latin'] })
const formattedYearRange = getFormattedYearRange(2024)

export const metadata = {
  title: 'BioStack',
  description: '[Manage your Biotech Samples]',
} satisfies Metadata

/**
 * Main layout to be reused in all the pages.
 * 
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex p-1 min-h-screen flex-col items-center justify-between">

          <header className="flex flex-col items-center">
            <h1 className="text-4xl">{metadata.title}</h1>
            <h2 className="text-sm">{metadata.description}</h2>
          </header>

          <main>
            {children}
          </main>

          <footer>
            <p className="text-xs opacity-25 hover:opacity-100">
              <a target="_blank" href="https://berenger.42borgata.com">
                Bérenger Dalle-Cort - {formattedYearRange}
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
