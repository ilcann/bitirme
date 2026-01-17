import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import { Link } from "react-router";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const { theme } = useTheme();
  const sizes = {
    sm: "h-14",
    md: "h-20",
    lg: "h-28",
  };

  return (
    <Link to="/" className={cn("relative flex items-center justify-center", className)}>
      { theme === "dark" ? (
        <img
          src={`/assets/matmuh-tr-b.png`}
          alt="İTÜ Logo"
          className={cn(
            "w-auto drop-shadow-sm p-2",
            sizes[size]
          )}
        />
      ) : 
        <img
          src={`/assets/matmuh-navy.png`}
          alt="İTÜ Logo"
          className={cn(
            "w-auto drop-shadow-sm",
            sizes[size]
          )}
        />
      }
    </Link>
  );
}