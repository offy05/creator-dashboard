import React from 'react';
import { ContentType } from '../types/content';

interface ContentTypeBadgeProps {
  contentType: ContentType;
}

export const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ contentType }) => {
  return (
    <span className="badge badge-content-type">
      {contentType}
    </span>
  );
};
