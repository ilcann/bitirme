import { useEffect } from 'react';

// Get the app title from the initial document title (set in index.html)
const getAppTitle = (() => {
  let appTitle: string | null = null;
  return () => {
    if (appTitle === null) {
      appTitle = document.title || 'ITU MAT';
    }
    return appTitle;
  };
})();

export function useDocumentTitle(pageTitle: string, description?: string) {
  useEffect(() => {
    const appTitle = getAppTitle();
    
    if (pageTitle) {
      // Format: "App Title - Page Title"
      document.title = `${appTitle} - ${pageTitle}`;
    }

    // Set meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.setAttribute('content', description);
    }
  }, [pageTitle, description]);
}
