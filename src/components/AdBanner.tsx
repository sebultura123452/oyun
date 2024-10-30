import React from 'react';
import config from '../data/config.json';

interface AdBannerProps {
  slot?: string;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot = config.adsense.slots.responsive, className = '' }) => {
  return (
    <div className={`w-full min-h-[90px] bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
      <div className="text-center">
        <p className="text-purple-300 text-sm font-medium">Advertisement</p>
        <p className="text-purple-400 text-xs mt-1">Ad Slot: {slot}</p>
      </div>
      <ins
        className="adsbygoogle hidden"
        style={{ display: 'block' }}
        data-ad-client={config.adsense.clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;