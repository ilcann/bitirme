import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";

const MyDashboardPage = () => {
    const { t } = useTranslation('me');
    
    useDocumentTitle(
        t('pages.me.dashboard.title'),
        t('pages.me.dashboard.description')
    );
    
    return <UnderConstruction />;
}

export default MyDashboardPage;