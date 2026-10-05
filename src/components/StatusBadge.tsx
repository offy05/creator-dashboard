import React from 'react';
import { ContentStatus } from '../types/content';

interface StatusBadgeProps {
  status: ContentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClassMap: Record<ContentStatus, string> = {
    Idea: 'badge-status-idea',
    Draft: 'badge-status-draft',
    Scheduled: 'badge-status-scheduled',
    Published: 'badge-status-published',
  };

  return (
    <span className={`badge ${statusClassMap[status] || 'badge-status-draft'}`} role="status">
      <span className="badge-dot" aria-hidden="true" />
      {status}
    </span>
  );
};
