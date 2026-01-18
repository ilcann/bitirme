import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    FileText, 
    ClipboardCheck, 
    Calendar, 
    AlertCircle, 
    BookOpen, 
    Clock,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const HelpPage = () => {
    const { t } = useTranslation();

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" as const }
    };

    const helpSections = [
        {
            id: "quizGuide",
            icon: BookOpen,
            color: "chart-1",
            gradient: "from-chart-1/5 to-transparent",
            pdfUrl: "/files/kisasinav_rehberi.pdf"
        },
        {
            id: "opticalForm",
            icon: ClipboardCheck,
            color: "chart-2",
            gradient: "from-chart-2/5 to-transparent",
            pdfUrl: "/files/optical_form.pdf"
        },
        {
            id: "makeupExams",
            icon: Calendar,
            color: "chart-4",
            gradient: "from-chart-4/5 to-transparent",
            pdfUrl: "/files/mazeret_makeup.pdf"
        },
        {
            id: "examAppeals",
            icon: AlertCircle,
            color: "chart-5",
            gradient: "from-chart-5/5 to-transparent",
            pdfUrl: "/files/itiraz_objection.pdf"
        }
    ];

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
            <div className="space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 p-3 rounded-xl bg-chart-3/20">
                            <FileText className="h-6 w-6 text-chart-3" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                {t('help.main.title')}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {t('help.main.description')}
                            </p>
                        </div>
                    </div>
                    {/* Help Sections Grid */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {helpSections.map((section, ) => {
                            const Icon = section.icon;
                            return (
                                <a 
                                    href={section.pdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block h-full"
                                >
                                    <Card className={`group relative rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:border-${section.color}/40 overflow-hidden h-full cursor-pointer`}>
                                        <div className={`absolute inset-0 bg-linear-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                                        
                                        <CardContent className="relative p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`shrink-0 p-3 rounded-xl bg-${section.color}/10 transition-transform duration-300 group-hover:scale-110`}>
                                                    <Icon className={`h-6 w-6 text-${section.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-200 mb-2">
                                                        {t(`help.sections.${section.id}.title`)}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {t(`help.sections.${section.id}.description`)}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            );
                        })}
                    </div>
                </motion.div>



                {/* Detailed Information */}
                <motion.div {...fadeInUp} className="space-wy-6">
                    <h2 className="text-2xl font-bold"></h2>
                    
                    <Accordion type="single" collapsible className="space-y-4">
                        {/* Sınavlar */}
                        <AccordionItem value="exams" className="border-2 rounded-xl px-6 bg-card">
                            <AccordionTrigger className="hover:no-underline py-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-chart-1/10">
                                        <BookOpen className="h-5 w-5 text-chart-1" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-lg">{t('help.exams.title')}</h3>
                                        <p className="text-sm text-muted-foreground">{t('help.exams.description')}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 pt-2">
                                <div className="space-y-6">
                                    {/* Örnek Sınav Programı */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="h-4 w-4 text-chart-1" />
                                            <span className="font-semibold">{t('help.sections.examGuide.title')}</span>
                                            <Badge variant="outline" className="ml-2">{t('help.sections.examGuide.description')}</Badge>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm font-medium">MAT103/E</span>
                                                    <span className="text-sm text-muted-foreground">13.01.2026</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">09:00 - 11:00</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm font-medium">MAT104/E</span>
                                                    <span className="text-sm text-muted-foreground">13.01.2026</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">15:00 - 17:00</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Önemli Kurallar */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-chart-5" />
                                            {t('help.sections.examGuide.title')}
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                <p>{t('help.sections.examGuide.rules.rule1')}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                <p>{t('help.sections.examGuide.rules.rule2')}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                <p>{t('help.sections.examGuide.rules.rule3')}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                                <p className="text-destructive">{t('help.sections.examGuide.rules.rule4')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Mazeret Sınavları */}
                        <AccordionItem value="makeup" className="border-2 rounded-xl px-6 bg-card">
                            <AccordionTrigger className="hover:no-underline py-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-chart-4/10">
                                        <Calendar className="h-5 w-5 text-chart-4" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-lg">{t('help.sections.makeupExamGuide.title')}</h3>
                                        <p className="text-sm text-muted-foreground">{t('help.sections.makeupExamGuide.description')}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 pt-2">
                                <div className="space-y-6">
                                    {/* Uyarı */}
                                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                            <div className="space-y-2">
                                                <p className="font-medium text-destructive">{t('help.sections.makeupExamGuide.warningTitle')}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t('help.sections.makeupExamGuide.warningDescription')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Başvuru Koşulları */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span className="font-semibold">{t('help.sections.makeupExamGuide.applicationConditionsTitle')}</span>
                                        </div>
                                        <div className="space-y-2 text-sm p-4 rounded-lg bg-muted/50">
                                            <p>{t('help.sections.makeupExamGuide.applicationConditions')}</p>
                                        </div>
                                    </div>

                                    {/* Örnek Mazeret Sınav Programı */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="h-4 w-4 text-chart-4" />
                                            <span className="font-semibold">{t('help.sections.makeupExamGuide.scheduleTitle')}</span>
                                            <Badge variant="outline" className="ml-2">{t('help.sections.makeupExamGuide.scheduleDuration')}</Badge>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm font-medium">MAT 103, 103E</span>
                                                    <span className="text-sm text-muted-foreground">21.01.2026</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">09:00</span>
                                                    <Badge variant="secondary" className="text-xs">FEB D202</Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm font-medium">MAT 104E</span>
                                                    <span className="text-sm text-muted-foreground">21.01.2026</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">09:00</span>
                                                    <Badge variant="secondary" className="text-xs">FEB D202</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ek Bilgi */}
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                {t('help.sections.makeupExamGuide.additionalInfo')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            </div>
        </main>
    );
}

export default HelpPage;