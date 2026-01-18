import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const HelpExamsPage = () => {
    const { t } = useTranslation('help');
    return <UnderConstruction pageTitle={t('exams.title')} description={t('exams.description')} />;
}

export default HelpExamsPage;