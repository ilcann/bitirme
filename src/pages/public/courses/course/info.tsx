import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const CourseInfoPage = () => {
    const { t } = useTranslation('courses');
    return <UnderConstruction pageTitle={t('info.title')} description={t('info.description')} />;
}

export default CourseInfoPage;