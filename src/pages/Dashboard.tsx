import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { ContentItem, DashboardStats } from '../types/content';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { ContentTypeBadge } from '../components/ContentTypeBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  Layers,
  FileEdit,
  CheckCircle2,
  Calendar,
  Lightbulb,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsData, allItems] = await Promise.all([
        contentService.getStats(),
        contentService.getAll(),
      ]);
      setStats(statsData);
      setRecentItems(allItems.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = contentService.subscribe(() => {
      fetchData();
    });
    return unsubscribe;
  }, []);

  if (loading && !stats) {
    return <LoadingSpinner message="Loading dashboard metrics..." />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="section-title">Creator Overview</h1>
          <p className="section-subtitle">
            Track your social media pipeline, pending drafts, and upcoming scheduled posts.
          </p>
        </div>
        <Link to="/content/new" className="btn btn-primary">
          <Plus size={16} />
          <span>Create Content</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          label="Total Content Ideas"
          value={stats?.total ?? 0}
          description="All pipeline items"
          icon={Layers}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
        />
        <StatsCard
          label="Drafts"
          value={stats?.drafts ?? 0}
          description="In progress & editing"
          icon={FileEdit}
          iconBgColor="#fffbeb"
          iconColor="#d97706"
        />
        <StatsCard
          label="Scheduled"
          value={stats?.scheduled ?? 0}
          description="Ready for publishing"
          icon={Calendar}
          iconBgColor="#f0f9ff"
          iconColor="#0284c7"
        />
        <StatsCard
          label="Published"
          value={stats?.published ?? 0}
          description="Live on social channels"
          icon={CheckCircle2}
          iconBgColor="#ecfdf5"
          iconColor="#059669"
        />
        <StatsCard
          label="Raw Ideas"
          value={stats?.ideas ?? 0}
          description="Backlog concepts"
          icon={Lightbulb}
          iconBgColor="#f5f3ff"
          iconColor="#7c3aed"
        />
      </div>

      {/* Recent Content Table Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#2563eb" />
            <h2 className="card-title">Recent Content Items</h2>
          </div>
          <Link to="/content" className="btn btn-secondary btn-sm">
            <span>View All Content</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <EmptyState
            title="No content ideas yet"
            description="Start filling your pipeline by creating your first content idea."
            actionLabel="Create Content"
            onAction={() => {}}
          />
        ) : (
          <div className="table-responsive">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Title & Summary</th>
                  <th>Platform</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item) => (
                  <tr key={item.id}>
                    <td className="table-title-cell">
                      <Link to={`/content/${item.id}`} className="table-title-link">
                        {item.title}
                      </Link>
                      <div className="table-subtitle">{item.description}</div>
                    </td>
                    <td>
                      <PlatformBadge platform={item.platform} />
                    </td>
                    <td>
                      <ContentTypeBadge contentType={item.contentType} />
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/content/${item.id}`}
                        className="btn btn-secondary btn-sm"
                        aria-label={`View or edit ${item.title}`}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
