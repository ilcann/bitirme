import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";

const NotFoundedPage = () => {
    const { t } = useTranslation('errors');
    
    useDocumentTitle(
        t('errors.not_found.title'),
        t('errors.not_found.description')
    );
    
    return <UnderConstruction />;
}

export default NotFoundedPage;