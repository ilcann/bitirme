import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";

const CourseOverviewPage = () => {
    const { t } = useTranslation('courses');
    
    useDocumentTitle(
        t('pages.courses.overview.title'),
        t('pages.courses.overview.description')
    );
    
    return <UnderConstruction />;
}

export default CourseOverviewPage;