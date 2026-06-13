import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";

const GradesPage = () => {
    const { t } = useTranslation('me');
    
    useDocumentTitle(
        t('pages.me.grades.title'),
        t('pages.me.grades.description')
    );
    
    return <UnderConstruction />;
}

export default GradesPage;