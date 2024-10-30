import React from 'react';
import { Helmet } from 'react-helmet-async';
import config from '../data/config.json';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = config.site.name,
  description = config.site.description,
  keywords = config.site.keywords,
  image = config.site.socialImage,
  url = config.site.url,
}) => {
  const fullTitle = title === config.site.name ? title : `${title} | ${config.site.name}`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={config.site.name} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={config.site.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Theme & Mobile */}
      <meta name="theme-color" content={config.site.themeColor} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* AdSense */}
      <script 
        async 
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsense.clientId}`}
        crossOrigin="anonymous"
      />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};