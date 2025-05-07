import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  category?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = 'Developer Tools',
  description = 'Privacy-focused encoding, decoding, and validation tools that run entirely in your browser',
  category
}) => {
  useEffect(() => {
    // Update page title
    let pageTitle = 'converter.shwrk';
    
    if (category && category !== 'all') {
      pageTitle += ` | ${category} Tools`;
    } else if (title) {
      pageTitle += ` | ${title}`;
    }
    
    document.title = pageTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      let descriptionText = description;
      
      if (category && category !== 'all') {
        descriptionText = `Privacy-focused ${category.toLowerCase()} tools for developers. All processing happens in your browser - no data is sent to servers.`;
      }
      
      metaDescription.setAttribute('content', descriptionText);
    }
    
    return () => {
      // Reset title on unmount
      document.title = 'converter.shwrk | Developer Tools';
      
      // Reset description
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Privacy-focused encoding, decoding, and validation tools that run entirely in your browser');
      }
    };
  }, [title, description, category]);
  
  return null;
}; 