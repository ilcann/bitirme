export const formatDate = (dateString: string, language: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
