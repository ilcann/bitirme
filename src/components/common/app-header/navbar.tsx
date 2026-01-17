import { useTranslation } from "react-i18next";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import NavLink from "../nav-link";
import { Bell, BookOpen, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type NavbarProps = {
  variant: 'desktop' | 'mobile';
  onNavigate?: () => void;
  className?: string;
};

const Navbar = ({ variant, onNavigate, className }: NavbarProps) => {
    const { t } = useTranslation();

    const orientation = variant === "mobile" ? "vertical" : "horizontal";

    return (
        <NavigationMenu 
         className={cn(
            orientation === "vertical" ? 
                "w-full justify-stretch items-stretch"
                :"",
            className
         )}
         delayDuration={50}
         orientation={orientation}
        >
            <NavigationMenuList 
                className={cn(
                    "flex gap-1 w-full flex-1 list-none",
                    "data-[orientation=vertical]:flex-col",
                    "data-[orientation=vertical]:items-stretch",
                    "data-[orientation=vertical]:justify-start",
                    "data-[orientation=horizontal]:items-center",
                    "data-[orientation=horizontal]:justify-center",
                )}
            >
                {/* Courses Menu */}
                <NavigationMenuItem>
                    <NavLink 
                        to="/courses"
                        title={t('nav.courses.title')}
                        icon={<BookOpen className="h-4 w-4" />}
                        onClick={onNavigate}
                    />
                </NavigationMenuItem>

                {/* Announcements */}
                <NavigationMenuItem>
                    <NavLink
                        to="/announcements"
                        title={t('nav.announcements.title')}
                        icon={<Bell className="h-4 w-4" />}
                        onClick={onNavigate}
                    />
                </NavigationMenuItem>

                {/* Help */}
                <NavigationMenuItem>
                    <NavLink
                        to="/help"
                        title={t('nav.help.title')}
                        icon={<HelpCircle className="h-4 w-4" />}
                        onClick={onNavigate}
                    />
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    )
};

export default Navbar;