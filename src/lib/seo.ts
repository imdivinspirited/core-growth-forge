export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export const updateSEO = (config: SEOConfig) => {
  // Update title
  document.title = config.title;

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  };

  // Description
  updateMetaTag('description', config.description);
  updateMetaTag('og:description', config.description, true);
  updateMetaTag('twitter:description', config.description);

  // Title
  updateMetaTag('og:title', config.title, true);
  updateMetaTag('twitter:title', config.title);

  // Keywords
  if (config.keywords && config.keywords.length > 0) {
    updateMetaTag('keywords', config.keywords.join(', '));
  }

  // OG Image
  if (config.ogImage) {
    updateMetaTag('og:image', config.ogImage, true);
    updateMetaTag('twitter:image', config.ogImage);
  }

  // Canonical URL
  if (config.canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', config.canonical);
  }

  // Set OG type
  updateMetaTag('og:type', 'website', true);
  updateMetaTag('twitter:card', 'summary_large_image');
};

export const defaultSEO: SEOConfig = {
  title: 'ovaboe.dev - Professional Development Platform',
  description: 'A comprehensive platform for students, professionals, and learners to enhance their skills, collaborate, and grow their careers.',
  keywords: ['development', 'learning', 'collaboration', 'professional growth', 'education'],
  ogImage: '/og-image.png',
};
