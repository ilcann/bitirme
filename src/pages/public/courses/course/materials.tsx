import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";

const CourseMaterialsPage = () => {
    const { t } = useTranslation('courses');
    
    useDocumentTitle(
        t('pages.courses.materials.title'),
        t('pages.courses.materials.description')
    );
    
    return <UnderConstruction />;
}

export default CourseMaterialsPage;