import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation('home');
  return <UnderConstruction pageTitle={t('title')} description={t('description')} />;
}

export default HomePage;