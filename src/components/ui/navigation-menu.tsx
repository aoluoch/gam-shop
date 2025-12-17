import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { navigationMenuTriggerStyle } from "./navigation-menu-styles"

interface NavigationMenuContextValue {
  value: string
  setValue: (value: string) => void
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue>({
  value: "",
  setValue: () => {},
})

function NavigationMenu({ 
  className, 
  children,
  ...props 
}: React.ComponentProps<"nav">) {
  const [value, setValue] = React.useState("")

  return (
    <NavigationMenuContext.Provider value={{ value, setValue }}>
      <nav
        data-slot="navigation-menu"
        className={cn(
          "relative z-10 flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  )
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({ 
  className, 
  children,
  ...props 
}: React.ComponentProps<"button">) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.parentElement?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <button
      ref={ref}
      data-slot="navigation-menu-trigger"
      data-state={open ? "open" : "closed"}
      className={cn(navigationMenuTriggerStyle, "group", className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
          open && "rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  )
}

function NavigationMenuContent({ 
  className,
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-menu-content"
      className={cn(
        "absolute left-0 top-full w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52",
        "data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52",
        "data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuLink({ 
  className,
  ...props 
}: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="navigation-menu-link"
      className={cn(navigationMenuTriggerStyle, className)}
      {...props}
    />
  )
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("absolute left-0 top-full flex justify-center")}>
      <div
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
