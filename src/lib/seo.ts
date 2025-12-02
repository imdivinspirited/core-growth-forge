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
  title: 'AuraUp - Elevate Your Skills, Transform Your Career',
  description: 'Elevate your skills with expert-led courses, interactive learning experiences, and personalized mentorship to unlock your full potential.',
  keywords: ['online learning', 'skill development', 'career growth', 'professional development', 'courses', 'training', 'education', 'mentorship'],
  ogImage: '/og-image.png',
};
