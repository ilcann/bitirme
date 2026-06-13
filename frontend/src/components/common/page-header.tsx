import { Badge } from "@/components/ui/badge";
import { Filter, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAudience } from "@/providers/audience-provider";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Header title */
  title: string;
  /** Optional description */
  description?: React.ReactNode;
  /** Icon component to display */
  icon?: LucideIcon;
  /** Icon container background color (e.g., 'bg-chart-1/20') */
  iconBgColor?: string;
  /** Icon text color (e.g., 'text-chart-1') */
  iconColor?: string;
  /** Variant: compact or wide */
  variant?: "compact" | "wide";
  /** Show audience badge */
  showAudienceBadge?: boolean;
  /** Additional content to render below header (e.g., filters, buttons) */
  children?: React.ReactNode;
  /** Additional CSS classes for container */
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  icon: Icon,
  iconBgColor = "bg-primary/20",
  iconColor = "text-primary",
  variant = "wide",
  showAudienceBadge = false,
  children,
  className,
}: PageHeaderProps) => {
  const { t } = useTranslation();
  const { audience } = useAudience();

  if (variant === "compact") {
    return (
      <div className={cn("border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60", className)}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {Icon && (
              <div className={cn("shrink-0 p-3 rounded-xl transition-transform duration-300", iconBgColor)}>
                <Icon className={cn("h-6 w-6", iconColor)} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-xl leading-tight mb-1">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
              {showAudienceBadge && (
                <Badge variant="outline" className="text-xs mt-2">
                  <Filter className="mr-1 h-3 w-3" />
                  {t(`common.audience.${audience}`)}
                </Badge>
              )}
            </div>
          </div>
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Wide variant (default)
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn("shrink-0 p-3 rounded-xl", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {showAudienceBadge && (
        <Badge variant="outline" className="text-sm">
          <Filter className="mr-2 h-4 w-4" />
          {t(`common.audience.${audience}`)}
        </Badge>
      )}

      {children}
    </div>
  );
};
