"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-brand-secondary" />,
        info: <InfoIcon className="size-4 text-brand" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-brand-secondary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-xl)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:border-[#e8e8e8] group-[.toaster]:bg-white group-[.toaster]:text-brand group-[.toaster]:shadow-lg group-[.toaster]:shadow-brand/10",
          title: "group-[.toast]:font-semibold group-[.toast]:text-brand",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:rounded-full group-[.toast]:bg-brand group-[.toast]:font-semibold group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:rounded-full group-[.toast]:bg-brand-background group-[.toast]:text-brand",
          closeButton:
            "group-[.toast]:rounded-full group-[.toast]:border group-[.toast]:border-[#e8e8e8] group-[.toast]:bg-brand-background group-[.toast]:text-brand",
          success:
            "group-[.toaster]:border-brand-secondary/30! group-[.toaster]:bg-brand-background-green! group-[.toaster]:text-brand!",
          error:
            "group-[.toaster]:border-destructive/30! group-[.toaster]:bg-red-50! group-[.toaster]:text-destructive!",
          warning:
            "group-[.toaster]:border-amber-200! group-[.toaster]:bg-amber-50! group-[.toaster]:text-amber-900!",
          info: "group-[.toaster]:border-brand/20! group-[.toaster]:bg-brand-background! group-[.toaster]:text-brand!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
