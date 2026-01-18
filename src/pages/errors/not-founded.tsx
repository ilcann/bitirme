import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const NotFoundedPage = () => {
    const { t } = useTranslation('errors');
    return <UnderConstruction pageTitle={t('not_found.title')} description={t('not_found.description')} />;
}

export default NotFoundedPage;