export const formatDate = (dateString: string, language: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

export const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return relativeTimeFormatter.format(0, 'day'); // "today"
    } else if (diffInDays > 0) {
        return relativeTimeFormatter.format(-diffInDays, 'day'); // e.g., "3 days ago"
    }
    return relativeTimeFormatter.format(diffInDays, 'day'); // e.g., "in 3 days"
};