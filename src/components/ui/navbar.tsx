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
        buttonVariants({ variant: "outline", size: "sm" }),
        isActive 
          ? "bg-white text-black font-semibold border-2 border-white" 
          : "bg-white/80 text-black font-medium hover:bg-white hover:text-black border border-white",
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
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="font-bold text-white text-xl px-3 py-2 rounded-md bg-black border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all duration-300 ml-2"
          >
            Peso
          </Link>
        </div>
        <nav className="flex items-center space-x-1 overflow-x-auto">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/workouts">Workouts</NavLink>
          <NavLink href="/exercises">Exercises</NavLink>
          {session ? (
            <>
              <NavLink href="/profile">Profile</NavLink>
              <Button variant="outline" size="sm" asChild className="ml-1">
                <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild className="ml-1">
              <Link href="/api/auth/signin">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
