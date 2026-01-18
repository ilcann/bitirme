import { UnderConstruction } from "@/components/common/under-construction";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";

const UnauthorizedPage = () => {
    const { t } = useTranslation();
    useDocumentTitle(
        t('errors.unauthorized.title'),
        t('errors.unauthorized.description')
    );

    return <UnderConstruction/>;
}

export default UnauthorizedPage;