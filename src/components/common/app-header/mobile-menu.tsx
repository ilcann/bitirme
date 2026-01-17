import { useState } from "react";
import { Menu, X, BookOpen, GraduationCap, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { coursesMenuItems, myAreaMenuItems } from "@/config/nav-links";
import { AudienceToggle } from "../audience-toggle";
import { LanguageToggle } from "../language-toggle";
import { ThemeToggle } from "../theme-toggle";
import { Menubar } from "@/components/ui/menubar";
import { cn } from "@/lib/utils";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Full Screen Overlay Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col px-6 pb-6 h-[calc(100%-64px)] overflow-y-auto">
          {/* Settings */}
          <div className="flex flex-col mb-6">
            <Menubar className="border-0">
              <AudienceToggle />
              <LanguageToggle />
              <ThemeToggle />
            </Menubar>
          </div>

          {/* Navigation Sections */}
          <nav className="flex flex-col gap-6">
            {/* Courses Section */}
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-3 text-foreground">
                <BookOpen className="h-5 w-5" />
                {t('nav.courses.title')}
              </h2>
              <ul className="flex flex-col gap-2 pl-7">
                {coursesMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={closeMenu}
                      className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="font-medium">{t(item.title)}</span>
                      <p className="text-sm opacity-75">{t(item.description)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* My Area Section */}
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-3 text-foreground">
                <GraduationCap className="h-5 w-5" />
                {t('nav.my_area.title')}
              </h2>
              <ul className="flex flex-col gap-2 pl-7">
                {myAreaMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={closeMenu}
                      className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="font-medium">{t(item.title)}</span>
                      <p className="text-sm opacity-75">{t(item.description)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Announcements */}
            <div>
              <Link
                to="/announcements"
                onClick={closeMenu}
                className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-accent-foreground transition-colors"
              >
                <Bell className="h-5 w-5" />
                {t('nav.announcements.title')}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
