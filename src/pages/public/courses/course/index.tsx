import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const CourseOverviewPage = () => {
    const { t } = useTranslation('courses');
    return <UnderConstruction pageTitle={t('overview.title')} description={t('overview.description')} />;
}

export default CourseOverviewPage;