"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search, Home, Package, Mail, Moon, Sun, Monitor, Github, Linkedin, Terminal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setOpen(false)}
      />
      <div className="relative z-50 w-[90vw] max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <Command 
          className="flex h-full w-full flex-col overflow-hidden bg-transparent"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-[var(--border)] px-4" cmdk-input-wrapper="">
            <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground opacity-70" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-[var(--foreground)]"
            />
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Navigation" className="px-2 py-1 text-xs font-medium text-muted-foreground">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-[var(--foreground)] mt-1 transition-colors"
              >
                <Home className="mr-3 h-4 w-4" />
                <span>Home</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/products"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-[var(--foreground)] mt-1 transition-colors"
              >
                <Package className="mr-3 h-4 w-4" />
                <span>Projects Marketplace</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/contact"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-[var(--foreground)] mt-1 transition-colors"
              >
                <Mail className="mr-3 h-4 w-4" />
                <span>Contact</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Separator className="-mx-2 my-1 h-px bg-[var(--border)]" />
            
            <Command.Group heading="Theme" className="px-2 py-1 text-xs font-medium text-muted-foreground">
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("light"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] text-[var(--foreground)] mt-1 transition-colors"
              >
                <Sun className="mr-3 h-4 w-4" />
                <span>Light Mode</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("dark"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] text-[var(--foreground)] mt-1 transition-colors"
              >
                <Moon className="mr-3 h-4 w-4" />
                <span>Dark Mode</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("system"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] text-[var(--foreground)] mt-1 transition-colors"
              >
                <Monitor className="mr-3 h-4 w-4" />
                <span>System Theme</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Separator className="-mx-2 my-1 h-px bg-[var(--border)]" />

            <Command.Group heading="Social & Profiles" className="px-2 py-1 text-xs font-medium text-muted-foreground">
              <Command.Item 
                onSelect={() => runCommand(() => window.open("https://github.com/Chougal", "_blank"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] text-[var(--foreground)] mt-1 transition-colors"
              >
                <Github className="mr-3 h-4 w-4" />
                <span>GitHub Profile</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => window.open("https://linkedin.com/in/abhishekchougale", "_blank"))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-[var(--glass)] aria-selected:text-[var(--primary)] text-[var(--foreground)] mt-1 transition-colors"
              >
                <Linkedin className="mr-3 h-4 w-4" />
                <span>LinkedIn Profile</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
          
          <div className="border-t border-[var(--border)] p-3 text-center sm:text-right">
            <div className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--glass)] px-2 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Terminal className="mr-2 h-3 w-3" />
              <span>ESC to close</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  )
}
