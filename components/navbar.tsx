"use client"
import { ModeToggle } from "./mode-toggle"

export function Navbar() {
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-balance text-lg font-semibold md:text-xl">Cricket Player Analytics</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
