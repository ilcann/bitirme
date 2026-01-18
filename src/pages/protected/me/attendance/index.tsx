import { UnderConstruction } from "@/components/common/under-construction";
import { useTranslation } from "react-i18next";

const AttendancePage = () => {
    const { t } = useTranslation('me');
    return <UnderConstruction pageTitle={t('attendance.title')} description={t('attendance.description')} />;
}

export default AttendancePage;