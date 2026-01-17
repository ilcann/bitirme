import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Bell, BookOpen, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { coursesMenuItems, myAreaMenuItems } from "@/config/nav-links";
import NavLink from "../nav-link";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const { t } = useTranslation();

    return (
        <NavigationMenu>
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