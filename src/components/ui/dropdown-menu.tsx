import * as React from "react"
import { ChevronRight, Check, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu")
  }
  return context
}

function DropdownMenu({ children, open: controlledOpen, onOpenChange }: { 
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void 
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setUncontrolledOpen

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children, asChild, className, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, setOpen } = useDropdownMenu()
  const triggerRef = React.useRef<HTMLElement>(null)
  
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.parentElement?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  const handleClick = () => setOpen(!open)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: handleClick,
    })
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      className={className}
      onClick={handleClick}
      aria-expanded={open}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({ 
  className, 
  align = "center",
  sideOffset = 4,
  children,
  ...props 
}: React.ComponentProps<"div"> & { 
  align?: "start" | "center" | "end"
  sideOffset?: number 
}) {
  const { open } = useDropdownMenu()
  
  if (!open) return null

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      data-slot="dropdown-menu-content"
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        alignClasses[align],
        className
      )}
      style={{ marginTop: sideOffset }}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({ 
  className, 
  inset,
  disabled,
  asChild,
  children,
  ...props 
}: React.ComponentProps<"div"> & { 
  inset?: boolean
  disabled?: boolean
  asChild?: boolean 
}) {
  const { setOpen } = useDropdownMenu()
  
  const itemClassName = cn(
    "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
    inset && "pl-8",
    disabled && "pointer-events-none opacity-50",
    className
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void; className?: string }>, {
      onClick: () => setOpen(false),
      className: cn(itemClassName, (children as React.ReactElement<{ className?: string }>).props.className),
    })
  }
  
  return (
    <div
      data-slot="dropdown-menu-item"
      className={itemClassName}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuCheckboxItem({ 
  className, 
  children, 
  checked,
  ...props 
}: React.ComponentProps<"div"> & { checked?: boolean }) {
  return (
    <DropdownMenuItem className={cn("pl-8", className)} {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

function DropdownMenuRadioItem({ 
  className, 
  children,
  checked,
  ...props 
}: React.ComponentProps<"div"> & { checked?: boolean }) {
  return (
    <DropdownMenuItem className={cn("pl-8", className)} {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

function DropdownMenuLabel({ 
  className, 
  inset,
  ...props 
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}

function DropdownMenuGroup({ children, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dropdown-menu-group" {...props}>{children}</div>
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>
}

function DropdownMenuSubTrigger({ 
  className, 
  inset,
  children,
  ...props 
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </div>
  )
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuRadioGroup({ children, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dropdown-menu-radio-group" {...props}>{children}</div>
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
}
