"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  collapsible?: "none" | "icon" | "full"
  collapsed?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      collapsible = "none",
      collapsed = false,
      ...props
    },
    ref
  ) => (
    <aside
      ref={ref}
      data-collapsible={collapsible}
      data-collapsed={collapsed}
      className={cn(
        /* CORE */
        "flex h-full shrink-0 flex-col border-r bg-background",

        /* WIDTH TRANSITION */
        "transition-[width] duration-300 ease-in-out",

        collapsed
          ? "w-0 overflow-hidden"
          : [
              /* DEFAULT (desktop inside max container) */
              "w-95",

              /* <= 976px height OR <= 427px width → ratio based */
              "max-[976px]:w-[30%]",
              "max-[427px]:w-[30%]",
            ].join(" "),

        className
      )}
      {...props}
    />
  )
)

Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 border-b", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
}
