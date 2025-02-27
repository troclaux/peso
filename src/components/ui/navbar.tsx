'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Session } from "next-auth"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        isActive && "bg-accent text-accent-foreground",
        className
      )}
    >
      {children}
    </Link>
  )
}

interface NavbarProps {
  session: Session | null
}

export function Navbar({ session }: NavbarProps) {
  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="font-bold text-white text-xl px-3 py-2 rounded-md bg-black border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all duration-300 ml-2"
          >
            Peso
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/workouts">Workouts</NavLink>
            <NavLink href="/exercises">Exercises</NavLink>
            <NavLink href="/profile">Profile</NavLink>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          {session ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/api/auth/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
