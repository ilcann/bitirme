import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const UnauthorizedPage = () => {
    const { t } = useTranslation('errors');
    return <UnderConstruction pageTitle={t('unauthorized.title')} description={t('unauthorized.description')} />;
}

export default UnauthorizedPage;