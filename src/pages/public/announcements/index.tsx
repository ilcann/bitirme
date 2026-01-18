import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const AnnouncementsPage = () => {
    const { t } = useTranslation('announcements');
    return <UnderConstruction pageTitle={t('list.title')} description={t('list.description')} />;
}

export default AnnouncementsPage;