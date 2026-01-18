import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FileText, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type FeaturedCourseCardProps = {
  id: string;
  code: string;
  titleKey: string;
  students: number;
  color: string;
};

export function FeaturedCourseCard({ id, code, titleKey, students, color }: FeaturedCourseCardProps) {
  const { t } = useTranslation();

  // Map color names to actual Tailwind classes
  const colorClasses = {
    'chart-1': {
      bg: 'bg-chart-1',
      bgLight: 'bg-chart-1/10',
      text: 'text-chart-1',
      border: 'border-chart-1/20',
      hoverBorder: 'hover:border-chart-1/40',
      gradient: 'from-chart-1/5 to-transparent'
    },
    'chart-2': {
      bg: 'bg-chart-2',
      bgLight: 'bg-chart-2/10',
      text: 'text-chart-2',
      border: 'border-chart-2/20',
      hoverBorder: 'hover:border-chart-2/40',
      gradient: 'from-chart-2/5 to-transparent'
    },
    'chart-3': {
      bg: 'bg-chart-3',
      bgLight: 'bg-chart-3/10',
      text: 'text-chart-3',
      border: 'border-chart-3/20',
      hoverBorder: 'hover:border-chart-3/40',
      gradient: 'from-chart-3/5 to-transparent'
    },
    'chart-4': {
      bg: 'bg-chart-4',
      bgLight: 'bg-chart-4/10',
      text: 'text-chart-4',
      border: 'border-chart-4/20',
      hoverBorder: 'hover:border-chart-4/40',
      gradient: 'from-chart-4/5 to-transparent'
    },
    'chart-5': {
      bg: 'bg-chart-5',
      bgLight: 'bg-chart-5/10',
      text: 'text-chart-5',
      border: 'border-chart-5/20',
      hoverBorder: 'hover:border-chart-5/40',
      gradient: 'from-chart-5/5 to-transparent'
    }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses['chart-1'];

  return (
    <Card className={`group relative rounded-2xl border-2 transition-all hover:shadow-xl ${colors.hoverBorder} overflow-hidden`}>
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
      
      <CardContent className="relative p-4 space-y-3 py-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`shrink-0 p-2.5 rounded-xl ${colors.bgLight} transition-transform group-hover:scale-110`}>
              <BookOpen className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
                {code}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {t(titleKey)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{students}</span>
            <span>{t("home.featured.students")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            asChild 
            size="sm" 
            className="rounded-lg font-medium"
          >
            <Link to={`/courses/${id}`}>
              {t("home.featured.open")}
            </Link>
          </Button>
          <Button 
            asChild 
            size="sm" 
            variant="outline" 
            className="rounded-lg font-medium"
          >
            <Link to={`/courses/${id}/materials`}>
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              {t("home.featured.materials")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
