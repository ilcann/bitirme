import { Construction } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UnderConstructionProps {
  pageTitle?: string;
  description?: string;
  className?: string;
}

export function UnderConstruction({ 
  pageTitle, 
  description,
  className 
}: UnderConstructionProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[70vh] px-4 ${className || ''}`}>
      <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
        {/* Page Title */}
        {pageTitle && (
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {pageTitle}
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </div>
        )}
        
        {/* Construction Icon */}
        <div className="relative">
          <Construction 
            className="h-20 w-20 text-muted-foreground animate-pulse" 
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl -z-10" />
        </div>
        
        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            {t('under_construction.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {description || t('under_construction.description')}
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2 mt-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
