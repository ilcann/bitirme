import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const HelpPage = () => {
    const { t } = useTranslation('help');
    return <UnderConstruction pageTitle={t('main.title')} description={t('main.description')} />;
}

export default HelpPage;