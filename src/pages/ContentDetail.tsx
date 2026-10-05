import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { ContentItem, Platform, ContentType, ContentStatus } from '../types/content';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { ContentTypeBadge } from '../components/ContentTypeBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
} from 'lucide-react';

const PLATFORMS: Platform[] = ['Instagram', 'YouTube', 'TikTok', 'X', 'Facebook'];
const CONTENT_TYPES: ContentType[] = ['Reel', 'Image', 'Meme', 'Short', 'Text'];
const STATUSES: ContentStatus[] = ['Idea', 'Draft', 'Scheduled', 'Published'];

export const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Edit form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [contentType, setContentType] = useState<ContentType>('Reel');
  const [status, setStatus] = useState<ContentStatus>('Draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadItem = async () => {
    if (!id) return;
    try {
      const data = await contentService.getById(id);
      if (data) {
        setItem(data);
        populateForm(data);
      } else {
        setItem(null);
      }
    } catch (err) {
      console.error('Error loading content item', err);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: ContentItem) => {
    setTitle(data.title);
    setDescription(data.description);
    setPlatform(data.platform);
    setContentType(data.contentType);
    setStatus(data.status);
    setScheduledDate(data.scheduledDate || '');
    setNotes(data.notes || '');
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const handleStatusQuickChange = async (newStatus: ContentStatus) => {
    if (!item) return;
    try {
      const updated = await contentService.updateStatus(item.id, newStatus);
      setItem(updated);
      setStatus(newStatus);
      setToastMessage(`Status updated to "${newStatus}".`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Failed to change status', err);
      setErrorBanner('Failed to update status.');
    }
  };

  const handleCancelEdit = () => {
    if (item) {
      populateForm(item);
    }
    setErrors({});
    setIsEditing(false);
  };

  const validateEditForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Content title is required.';
    }
    if (!description.trim()) {
      errs.description = 'Content description is required.';
    }
    if (status === 'Scheduled' && !scheduledDate) {
      errs.scheduledDate = 'Scheduled date is required for Scheduled content.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !validateEditForm()) return;

    setSaving(true);
    try {
      const updated = await contentService.update(item.id, {
        title: title.trim(),
        description: description.trim(),
        platform,
        contentType,
        status,
        scheduledDate,
        notes: notes.trim(),
      });
      setItem(updated);
      setIsEditing(false);
      setToastMessage('Changes saved successfully!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to update content', err);
      setErrorBanner('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!item) return;
    try {
      await contentService.delete(item.id);
      setShowDeleteModal(false);
      navigate('/content');
    } catch (err) {
      console.error('Failed to delete content', err);
      setErrorBanner('Could not delete item. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading content details..." />;
  }

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Content item not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          The item with ID "{id}" may have been removed or does not exist.
        </p>
        <Link to="/content" className="btn btn-primary">
          Back to Content Library
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Back Link and Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Link
          to="/content"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Content Library</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={15} />
                <span>Edit Content</span>
              </button>
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancelEdit}
            >
              <X size={15} />
              <span>Cancel Editing</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="alert-banner alert-success" role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            className="btn-icon-only"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss alert"
          >
            &times;
          </button>
        </div>
      )}

      {errorBanner && (
        <div className="alert-banner alert-error" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} />
            <span>{errorBanner}</span>
          </div>
          <button
            type="button"
            className="btn-icon-only"
            onClick={() => setErrorBanner(null)}
            aria-label="Dismiss alert"
          >
            &times;
          </button>
        </div>
      )}

      {isEditing ? (
        /* Edit Mode Form Card */
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Edit3 size={18} color="var(--primary)" />
              <h2 className="card-title">Edit Content Item</h2>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSaveEdit} noValidate>
              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label htmlFor="edit-title" className="form-label">
                    Content Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    className={`form-control ${errors.title ? 'has-error' : ''}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={saving}
                  />
                  {errors.title && <p className="form-error-msg">{errors.title}</p>}
                </div>

                <div className="form-group col-span-2">
                  <label htmlFor="edit-description" className="form-label">
                    Description / Script Outline <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="edit-description"
                    className={`form-control ${errors.description ? 'has-error' : ''}`}
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={saving}
                  />
                  {errors.description && <p className="form-error-msg">{errors.description}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="edit-platform" className="form-label">
                    Target Platform <span className="required-star">*</span>
                  </label>
                  <select
                    id="edit-platform"
                    className="form-control"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    disabled={saving}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-content-type" className="form-label">
                    Content Type <span className="required-star">*</span>
                  </label>
                  <select
                    id="edit-content-type"
                    className="form-control"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentType)}
                    disabled={saving}
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-status" className="form-label">
                    Workflow Status <span className="required-star">*</span>
                  </label>
                  <select
                    id="edit-status"
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ContentStatus)}
                    disabled={saving}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-scheduled-date" className="form-label">
                    Scheduled Date {status === 'Scheduled' && <span className="required-star">*</span>}
                  </label>
                  <input
                    type="date"
                    id="edit-scheduled-date"
                    className={`form-control ${errors.scheduledDate ? 'has-error' : ''}`}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    disabled={saving}
                  />
                  {errors.scheduledDate && <p className="form-error-msg">{errors.scheduledDate}</p>}
                </div>

                <div className="form-group col-span-2">
                  <label htmlFor="edit-notes" className="form-label">
                    Internal Notes & Assets
                  </label>
                  <textarea
                    id="edit-notes"
                    className="form-control"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <Save size={16} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Read Mode Detail Cards */
        <div className="detail-grid">
          {/* Main Details */}
          <div>
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PlatformBadge platform={item.platform} />
                  <ContentTypeBadge contentType={item.contentType} />
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <div className="card-body">
                <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.3 }}>
                  {item.title}
                </h1>

                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
                    Description & Script Outline
                  </h3>
                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                    {item.description}
                  </div>
                </div>

                {item.notes && (
                  <div>
                    <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
                      Production Notes & Checklist
                    </h3>
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                      {item.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Metadata & Quick Status Switch */}
          <div>
            {/* Quick Status Box */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 14 }}>Change Status</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`btn btn-sm ${item.status === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => handleStatusQuickChange(st)}
                  >
                    {item.status === st && <CheckCircle2 size={14} />}
                    <span>Mark as {st}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Meta Information Box */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ fontSize: 14 }}>Item Metadata</h3>
              </div>
              <div className="card-body" style={{ padding: '16px 20px' }}>
                <div className="meta-group">
                  <div className="meta-label">Scheduled Date</div>
                  <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    {item.scheduledDate || 'Not Scheduled'}
                  </div>
                </div>

                <div className="meta-group">
                  <div className="meta-label">Created At</div>
                  <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} color="var(--text-muted)" />
                    {new Date(item.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>

                <div className="meta-group">
                  <div className="meta-label">Last Updated</div>
                  <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} color="var(--text-muted)" />
                    {new Date(item.updatedAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>

                <div className="meta-group">
                  <div className="meta-label">Internal Item ID</div>
                  <div className="meta-value" style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                    {item.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Content Item"
        message={`Are you sure you want to permanently delete "${item.title}"? This cannot be undone.`}
        confirmLabel="Delete Item"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
