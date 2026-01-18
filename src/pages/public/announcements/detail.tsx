import { UnderConstruction } from "@/components/common/under-construction";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";

const AnnouncementsDetailPage = () => {
    const { t } = useTranslation('announcements');
    useDocumentTitle(
        t('announcements.detail.title'),
        t('announcements.detail.description')
    );

    return <UnderConstruction/>;
}

export default AnnouncementsDetailPage;