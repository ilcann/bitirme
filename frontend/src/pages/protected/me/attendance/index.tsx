import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";

const AttendancePage = () => {
    const { t } = useTranslation('me');
    
    useDocumentTitle(
        t('pages.me.attendance.title'),
        t('pages.me.attendance.description')
    );
    
    return <UnderConstruction />;
}

export default AttendancePage;