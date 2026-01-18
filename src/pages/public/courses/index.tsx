import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const CoursesListPage = () => {
    const { t } = useTranslation('courses');
    return <UnderConstruction pageTitle={t('list.title')} description={t('list.description')} />;
}

export default CoursesListPage;