"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense, useEffect, useState } from "react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [fontClasses, setFontClasses] = useState("")

  // Apply Geist font variables after mount to avoid hydration mismatch
  useEffect(() => {
    setFontClasses(`${GeistSans.variable} ${GeistMono.variable}`)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>

        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
