import { Link } from "react-router";
import { NavigationMenuLink } from "../ui/navigation-menu";

interface NavLinkProps extends React.ComponentPropsWithoutRef<'li'> {
  to: string;
  title: string;
  icon?: React.ReactNode;
}

function NavLink({ title, children, to, icon }: NavLinkProps) {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={to}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="flex items-center gap-2 text-sm font-medium leading-none">
          {icon}
          {title}
        </div>
        {children && (
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        )}
      </Link>
    </NavigationMenuLink>
  );
}

export default NavLink;