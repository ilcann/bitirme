import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Bell, BookOpen, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { coursesMenuItems, myAreaMenuItems } from "@/config/nav-links";
import NavLink from "../nav-link";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

type NavbarProps = {
  variant: 'desktop' | 'mobile';
  onNavigate?: () => void;
  className?: string;
};

const Navbar = ({ variant, onNavigate, className }: NavbarProps) => {
    const { t } = useTranslation();

    if (variant === 'mobile') {
        return (
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
                        onClick={onNavigate}
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
                        onClick={onNavigate}
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
                    onClick={onNavigate}
                    className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-accent-foreground transition-colors"
                >
                <Bell className="h-5 w-5" />
                {t('nav.announcements.title')}
                </Link>
            </div>
        </nav>
        )
    }

    return (
        <NavigationMenu className={className} delayDuration={50}>
            <NavigationMenuList className="flex-wrap">
                {/* Courses Menu */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <BookOpen className="mr-2 h-4 w-4" />
                        {t('nav.courses.title')}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-100 gap-2 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                            {coursesMenuItems.map((item) => (
                                <li>
                                    <NavLink
                                        key={item.href}
                                        title={t(item.title)}
                                        href={item.href}
                                    >
                                        {t(item.description)}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* My Area Menu */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {t('nav.my_area.title')}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-100 gap-2 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                            {myAreaMenuItems.map((item) => (
                                <li>
                                    <NavLink
                                        key={item.href}
                                        title={t(item.title)}
                                        href={item.href}
                                    >
                                        {t(item.description)}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                {/* Announcements */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild  className={cn(navigationMenuTriggerStyle(), "group")}>
                        <Link 
                            to="/announcements"
                            className="flex flex-row"
                        >
                            <Bell className="mr-2 h-4 w-4" />
                            {t('nav.announcements.title')}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default Navbar;