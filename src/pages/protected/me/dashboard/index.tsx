import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const MyDashboardPage = () => {
    const { t } = useTranslation('me');
    return <UnderConstruction pageTitle={t('dashboard.title')} description={t('dashboard.description')} />;
}

export default MyDashboardPage;