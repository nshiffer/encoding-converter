import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  category?: string;
  canonical?: string;
  keywords?: string[];
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Developer Tools',
  description = 'Privacy-focused encoding, decoding, and validation tools that run entirely in your browser',
  category,
  canonical,
  keywords,
}) => {
  useEffect(() => {
    // Update page title
    let pageTitle = 'converter.shwrk';

    if (title && title !== 'Developer Tools') {
      pageTitle += ` | ${title}`;
    } else if (category && category !== 'All Tools') {
      pageTitle += ` | ${category} Tools`;
    }

    document.title = pageTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      let descriptionText = description;

      if (category && category !== 'All Tools') {
        descriptionText = `Privacy-focused ${category.toLowerCase()} tools for developers. All processing happens in your browser - no data is sent to servers.`;
      }

      metaDescription.setAttribute('content', descriptionText);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    } else if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://converter.shwrk.com');
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (keywords && keywords.length > 0) {
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (ogUrl && canonical) ogUrl.setAttribute('content', canonical);

    return () => {
      document.title = 'converter.shwrk | Developer Tools';
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Privacy-focused encoding, decoding, and validation tools that run entirely in your browser');
      }
      if (canonicalLink) {
        canonicalLink.setAttribute('href', 'https://converter.shwrk.com');
      }
    };
  }, [title, description, category, canonical, keywords]);

  return null;
};
