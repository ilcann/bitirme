import { Button } from "@/components/ui/button";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type GradientButtonProps = {
  to: string;
  children: React.ReactNode;
  color?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "ghost" | "primary";
};

export function GradientButton({ to, children, color = "chart-1", className, size = "lg", variant = "default" }: GradientButtonProps) {
  const colorClasses: Record<string, { default: string; ghost: string }> = {
    'chart-1': {
      default: "hover:bg-gradient-to-br hover:from-chart-1/20 hover:via-chart-1/10 hover:to-transparent hover:border-chart-1/60 hover:shadow-lg hover:shadow-chart-1/10",
      ghost: "border-transparent hover:border-chart-1/40 hover:bg-gradient-to-br hover:from-chart-1/20 hover:via-chart-1/10 hover:to-transparent hover:text-foreground"
    },
    'chart-2': {
      default: "hover:bg-gradient-to-br hover:from-chart-2/20 hover:via-chart-2/10 hover:to-transparent hover:border-chart-2/60 hover:shadow-lg hover:shadow-chart-2/10",
      ghost: "border-transparent hover:border-chart-2/40 hover:bg-gradient-to-br hover:from-chart-2/20 hover:via-chart-2/10 hover:to-transparent hover:text-foreground"
    },
    'chart-3': {
      default: "hover:bg-gradient-to-br hover:from-chart-3/20 hover:via-chart-3/10 hover:to-transparent hover:border-chart-3/60 hover:shadow-lg hover:shadow-chart-3/10",
      ghost: "border-transparent hover:border-chart-3/40 hover:bg-gradient-to-br hover:from-chart-3/20 hover:via-chart-3/10 hover:to-transparent hover:text-foreground"
    },
    'chart-4': {
      default: "hover:bg-gradient-to-br hover:from-chart-4/20 hover:via-chart-4/10 hover:to-transparent hover:border-chart-4/60 hover:shadow-lg hover:shadow-chart-4/10",
      ghost: "border-transparent hover:border-chart-4/40 hover:bg-gradient-to-br hover:from-chart-4/20 hover:via-chart-4/10 hover:to-transparent hover:text-foreground"
    },
    'chart-5': {
      default: "hover:bg-gradient-to-br hover:from-chart-5/20 hover:via-chart-5/10 hover:to-transparent hover:border-chart-5/60 hover:shadow-lg hover:shadow-chart-5/10",
      ghost: "border-transparent hover:border-chart-5/40 hover:bg-gradient-to-br hover:from-chart-5/20 hover:via-chart-5/10 hover:to-transparent hover:text-foreground"
    },
  };

  // Primary variant uses MovingBorder
  if (variant === "primary") {
    const heightMap = {
      sm: "h-9",
      default: "h-10",
      lg: "h-12"
    };

    return (
      <MovingBorderButton
        as="div"
        containerClassName={cn("w-full", heightMap[size], className)}
        className="rounded-xl font-semibold cursor-pointer bg-primary/90 border-primary/30 flex items-center justify-center"
        borderRadius="0.75rem"
      >
        <Link to={to} className="flex items-center justify-center w-full h-full">
          {children}
        </Link>
      </MovingBorderButton>
    );
  }

  const colorClass = colorClasses[color]?.[variant] || colorClasses['chart-1'][variant];
  const baseClasses = variant === "ghost" 
    ? "rounded-xl border-2 transition-all duration-300"
    : "rounded-xl border border-primary/30 bg-background/50 transition-all duration-300";

  return (
    <Button
      asChild
      variant="ghost"
      size={size}
      className={cn(
        baseClasses,
        colorClass,
        className
      )}
    >
      <Link to={to}>
        {children}
      </Link>
    </Button>
  );
}
