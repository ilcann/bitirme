import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const GradesPage = () => {
    const { t } = useTranslation('me');
    return <UnderConstruction pageTitle={t('grades.title')} description={t('grades.description')} />;
}

export default GradesPage;