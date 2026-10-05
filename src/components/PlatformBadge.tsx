import React from 'react';
import { Platform } from '../types/content';

interface PlatformBadgeProps {
  platform: Platform;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform }) => {
  const platformClassMap: Record<Platform, string> = {
    Facebook: 'badge-platform-facebook',
    Instagram: 'badge-platform-instagram',
    YouTube: 'badge-platform-youtube',
    TikTok: 'badge-platform-tiktok',
    X: 'badge-platform-x',
  };

  return (
    <span className={`badge ${platformClassMap[platform] || 'badge-platform-x'}`}>
      {platform}
    </span>
  );
};
