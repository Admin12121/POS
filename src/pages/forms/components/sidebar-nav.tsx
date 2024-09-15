"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation()
  const pathname = location.pathname.split('/').pop()
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const normalizedPathname = pathname?.replace(/^\/+/, '')
        const normalizedHref = item.href.replace(/^\/+/, '')
        const isActive = normalizedPathname === normalizedHref || normalizedPathname?.endsWith(normalizedHref)
        return (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            isActive
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      )})}
    </nav>
  )
}
