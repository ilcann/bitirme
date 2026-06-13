import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";

const CourseInfoPage = () => {
    const { t } = useTranslation('courses');
    
    useDocumentTitle(
        t('pages.courses.info.title'),
        t('pages.courses.info.description')
    );
    
    return <UnderConstruction />;
}

export default CourseInfoPage;