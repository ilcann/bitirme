import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import { 
    FileText, 
    FileCheck, 
    FileQuestion, 
    File, 
    Video, 
    Link as LinkIcon,
    Download,
    ExternalLink,
    Calendar
} from "lucide-react";
import type { MaterialType, CourseMaterial as Material } from "@/mock/courses";
import { useTranslation } from "react-i18next";

interface MaterialCardProps {
    material: Material;
}

const getMaterialIcon = (type: MaterialType) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
        case "lecture":
            return <FileText {...iconProps} />;
        case "assignment":
            return <FileCheck {...iconProps} />;
        case "exam":
            return <FileQuestion {...iconProps} />;
        case "document":
            return <File {...iconProps} />;
        case "video":
            return <Video {...iconProps} />;
        case "link":
            return <LinkIcon {...iconProps} />;
        default:
            return <File {...iconProps} />;
    }
};

const getMaterialColor = (type: MaterialType): string => {
    switch (type) {
        case "lecture":
            return "bg-chart-1/10 text-chart-1 hover:bg-chart-1/20";
        case "assignment":
            return "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20";
        case "exam":
            return "bg-destructive/10 text-destructive hover:bg-destructive/20";
        case "document":
            return "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20";
        case "video":
            return "bg-chart-5/10 text-chart-5 hover:bg-chart-5/20";
        case "link":
            return "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20";
        default:
            return "bg-muted/50 text-muted-foreground hover:bg-muted";
    }
};

export const MaterialCard = ({ material }: MaterialCardProps) => {
    const { t, i18n } = useTranslation('courses');

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getMaterialColor(material.type)}`}>
                            {getMaterialIcon(material.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-1">
                                {material.title[i18n.language as 'tr' | 'en']}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="font-normal">
                                    {t(`courses.materials.types.${material.type}`)}
                                </Badge>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(material.date, i18n.language)}
                                </span>
                                {material.size && (
                                    <span>• {material.size}</span>
                                )}
                            </div>
                            {material.description && (
                                <CardDescription className="mt-2">
                                    {material.description[i18n.language as 'tr' | 'en']}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {material.type === "link" || material.type === "video" ? (
                            <Button size="sm" variant="outline" asChild>
                                <a href={material.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    {t('courses.materials.open')}
                                </a>
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" asChild>
                                <a href={material.url} download>
                                    <Download className="h-4 w-4 mr-2" />
                                    {t('courses.materials.download')}
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};
