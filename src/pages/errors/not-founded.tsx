import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Link } from "react-router";
import { AlertCircle } from "lucide-react";

const NotFoundedPage = () => {
    const { t } = useTranslation('errors');

    useDocumentTitle(
        t('not_found.title'),
        t('not_found.description')
    );

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-16">
            <div className="flex flex-col items-center justify-center text-center gap-8">
                <div className="p-6 rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {t('errors.not_found.title')}
                    </h1>
                    <p className="text-muted-foreground">{t('errors.not_found.description')}</p>
                </div>

                <div className="pt-4">
                    <Button asChild variant="default" className="rounded-xl">
                        <Link to="/">{t('errors.go_home') || 'Go to Home'}</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}

export default NotFoundedPage;