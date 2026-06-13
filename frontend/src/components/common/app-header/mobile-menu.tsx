import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudienceToggle } from "../audience-toggle";
import { LanguageToggle } from "../language-toggle";
import { ThemeToggle } from "../theme-toggle";
import { Menubar } from "@/components/ui/menubar";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navbar from "./navbar";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-screen max-w-none h-screen overflow-hidden p-4 lg:hidden"
      >
        {/* Üstte close sabit */}
        <Menubar className="border-0 mb-6 bg-transparent">
            <AudienceToggle align="start"/>
            <LanguageToggle align="start"/>
            <ThemeToggle align="start"/>
            <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                aria-label="Close menu"
                className="ml-auto"
            >
                <X className="h-6 w-6" />
            </Button>
        </Menubar>

        {/* Navbar mobile variant: kendi içinde scroll var */}
        <Navbar
          variant="mobile"
          onNavigate={closeMenu}
          className="h-[calc(100%-64px)]"
        />
      </SheetContent>
    </Sheet>
  )
};

export default MobileMenu;
