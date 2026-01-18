import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const AnnouncementsDetailPage = () => {
    const { t } = useTranslation('announcements');
    return <UnderConstruction pageTitle={t('detail.title')} description={t('detail.description')} />;
}

export default AnnouncementsDetailPage;