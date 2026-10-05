import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { ContentItem, Platform, ContentStatus } from '../types/content';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { ContentTypeBadge } from '../components/ContentTypeBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Calendar,
  Check,
} from 'lucide-react';

const PLATFORMS: Array<Platform | 'All'> = ['All', 'Instagram', 'YouTube', 'TikTok', 'X', 'Facebook'];
const STATUSES: Array<ContentStatus | 'All'> = ['All', 'Idea', 'Draft', 'Scheduled', 'Published'];

export const ContentList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters state from URL query or local defaults
  const searchQuery = searchParams.get('q') || '';
  const selectedPlatform = (searchParams.get('platform') as Platform | 'All') || 'All';
  const selectedStatus = (searchParams.get('status') as ContentStatus | 'All') || 'All';

  const loadContent = async () => {
    try {
      const data = await contentService.getAll({
        searchQuery,
        platform: selectedPlatform,
        status: selectedStatus,
      });
      setItems(data);
    } catch (err) {
      console.error('Error fetching content items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
    const unsubscribe = contentService.subscribe(() => {
      loadContent();
    });
    return unsubscribe;
  }, [searchQuery, selectedPlatform, selectedStatus]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'All') {
      newParams.set('platform', val);
    } else {
      newParams.delete('platform');
    }
    setSearchParams(newParams);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'All') {
      newParams.set('status', val);
    } else {
      newParams.delete('status');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await contentService.delete(itemToDelete.id);
      setToastMessage(`"${itemToDelete.title}" was successfully deleted.`);
      setItemToDelete(null);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to delete content', err);
    }
  };

  const hasActiveFilters = searchQuery !== '' || selectedPlatform !== 'All' || selectedStatus !== 'All';

  return (
    <div>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="alert-banner alert-success" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            className="btn-icon-only"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss message"
          >
            &times;
          </button>
        </div>
      )}

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1 className="section-title">Content Library</h1>
          <p className="section-subtitle">
            Manage, filter, and plan all your cross-platform social media posts.
          </p>
        </div>
        <Link to="/content/new" className="btn btn-primary">
          <Plus size={16} />
          <span>Create Content</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '16px 20px' }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            {/* Search */}
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                id="content-search"
                className="search-input"
                placeholder="Search by title, description, notes, or format..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search content library"
              />
            </div>

            {/* Platform Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label htmlFor="platform-filter" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                Platform:
              </label>
              <select
                id="platform-filter"
                className="filter-select"
                value={selectedPlatform}
                onChange={handlePlatformChange}
                aria-label="Filter by platform"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p === 'All' ? 'All Platforms' : p}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label htmlFor="status-filter" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                Status:
              </label>
              <select
                id="status-filter"
                className="filter-select"
                value={selectedStatus}
                onChange={handleStatusChange}
                aria-label="Filter by status"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetFilters}
                title="Reset all search and filter conditions"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Table Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Showing {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Filtering content library..." />
        ) : items.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              title="No matching content found"
              description="Try adjusting your search keywords or removing selected filters."
              actionLabel="Clear Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <EmptyState
              title="Your content library is empty"
              description="Get started by creating your first post concept, draft, or schedule."
              actionLabel="Create First Item"
              onAction={() => {}}
            />
          )
        ) : (
          <div className="table-responsive">
            <table className="content-table" aria-label="Content Library Table">
              <thead>
                <tr>
                  <th>Title & Description</th>
                  <th>Platform</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Scheduled For</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
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
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {item.scheduledDate ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={13} color="var(--text-muted)" />
                          {item.scheduledDate}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Link
                          to={`/content/${item.id}`}
                          className="btn btn-secondary btn-sm"
                          title="View and edit item"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger-outline btn-sm"
                          onClick={() => setItemToDelete(item)}
                          title="Delete item"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={itemToDelete !== null}
        title="Delete Content Item"
        message={`Are you sure you want to permanently delete "${itemToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Item"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
