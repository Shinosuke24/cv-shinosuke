"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  activeSection: string
  onSectionClick: (section: string) => void
}

export function Navigation({ activeSection, onSectionClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Me" },
    { id: "skills", label: "Skills" },
    { id: "work", label: "Experience" }, 
    { id: "education", label: "Education" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ]

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-6 left-1/2 transform -translate-x-1/2 z-40 bg-card/90 backdrop-blur-md border rounded-full px-6 py-2 shadow-lg">
        <div className="flex gap-1">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              className="rounded-full hover:scale-105 transition-all duration-200 text-sm px-4 py-2"
              onClick={() => handleSectionClick(section.id)}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-4 left-4 z-40" ref={menuRef}>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-card/90 backdrop-blur-md hover:scale-105 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>

        {isOpen && (
          <div className="absolute top-12 left-0 bg-card/95 backdrop-blur-md border rounded-lg p-3 shadow-xl min-w-[140px] max-w-[160px]">
            <div className="flex flex-col gap-1">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  size="sm"
                  className="justify-start text-sm px-3 py-2 hover:scale-105 transition-all duration-200"
                  onClick={() => handleSectionClick(section.id)}
                >
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}