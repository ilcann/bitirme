import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const CourseMaterialsPage = () => {
    const { t } = useTranslation('courses');
    return <UnderConstruction pageTitle={t('materials.title')} description={t('materials.description')} />;
}

export default CourseMaterialsPage;