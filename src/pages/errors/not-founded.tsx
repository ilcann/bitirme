import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Link } from "react-router";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundedPage = () => {
    const { t } = useTranslation();

    useDocumentTitle(
        t('errors.not_found.title'),
        t('errors.not_found.description')
    );

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
            <motion.div 
                className="flex flex-col items-center justify-center text-center gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-6 rounded-full bg-destructive/10">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {t('errors.not_found.title')}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-md">
                        {t('errors.not_found.description')}
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button asChild variant="outline" className="rounded-xl gap-2">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4" />
                            {t('common.back')}
                        </Link>
                    </Button>
                    <Button asChild variant="default" className="rounded-xl gap-2">
                        <Link to="/">
                            <Home className="h-4 w-4" />
                            {t('common.home')}
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </main>
    );
}

export default NotFoundedPage;