import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  description,
  icon: Icon,
  iconBgColor = '#eff6ff',
  iconColor = '#2563eb',
}) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div
          className="stat-icon-wrapper"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
          aria-hidden="true"
        >
          <Icon size={18} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {description && <div className="stat-description">{description}</div>}
    </div>
  );
};
