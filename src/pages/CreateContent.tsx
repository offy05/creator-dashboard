import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Platform, ContentType, ContentStatus } from '../types/content';
import { ArrowLeft, Save, AlertCircle, FileEdit, Check } from 'lucide-react';

const PLATFORMS: Platform[] = ['Instagram', 'YouTube', 'TikTok', 'X', 'Facebook'];
const CONTENT_TYPES: ContentType[] = ['Reel', 'Image', 'Meme', 'Short', 'Text'];
const STATUSES: ContentStatus[] = ['Idea', 'Draft', 'Scheduled', 'Published'];

export const CreateContent: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [contentType, setContentType] = useState<ContentType>('Reel');
  const [status, setStatus] = useState<ContentStatus>('Draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Content title is required.';
    } else if (title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters long.';
    }

    if (!description.trim()) {
      errs.description = 'Content description/summary is required.';
    }

    if (status === 'Scheduled' && !scheduledDate) {
      errs.scheduledDate = 'Scheduled date is required when status is Scheduled.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (forcedStatus?: ContentStatus) => {
    const targetStatus = forcedStatus || status;

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await contentService.create({
        title: title.trim(),
        description: description.trim(),
        platform,
        contentType,
        status: targetStatus,
        scheduledDate: scheduledDate || '',
        notes: notes.trim(),
      });

      setSuccessToast(true);
      setTimeout(() => {
        navigate('/content');
      }, 700);
    } catch (err) {
      console.error('Failed to create content item', err);
      setErrors({ form: 'An unexpected error occurred while saving. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      {/* Back button and Page Title */}
      <div style={{ marginBottom: 20 }}>
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
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Content Library</span>
        </Link>
        <h1 className="section-title">Create New Content</h1>
        <p className="section-subtitle">
          Draft a new social media post concept, assign target platform, and set production schedules.
        </p>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="alert-banner alert-success" role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={16} />
            <span>Content successfully created! Redirecting to library...</span>
          </div>
        </div>
      )}

      {/* Form Error Banner */}
      {errors.form && (
        <div className="alert-banner alert-error" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} />
            <span>{errors.form}</span>
          </div>
        </div>
      )}

      {/* Create Content Form Card */}
      <div className="card">
        <div className="card-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            noValidate
          >
            <div className="form-grid">
              {/* Title */}
              <div className="form-group col-span-2">
                <label htmlFor="content-title" className="form-label">
                  Content Title <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="content-title"
                  className={`form-control ${errors.title ? 'has-error' : ''}`}
                  placeholder="e.g., 5 Micro-Animations in Pure CSS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                  autoFocus
                />
                {errors.title && <p className="form-error-msg">{errors.title}</p>}
                <p className="form-helper">A catchy working headline for your post or video.</p>
              </div>

              {/* Description */}
              <div className="form-group col-span-2">
                <label htmlFor="content-desc" className="form-label">
                  Description / Script Outline <span className="required-star">*</span>
                </label>
                <textarea
                  id="content-desc"
                  className={`form-control ${errors.description ? 'has-error' : ''}`}
                  placeholder="Write a concise overview of the post hook, key points, and call to action..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={submitting}
                />
                {errors.description && <p className="form-error-msg">{errors.description}</p>}
              </div>

              {/* Platform Dropdown */}
              <div className="form-group">
                <label htmlFor="content-platform" className="form-label">
                  Target Platform <span className="required-star">*</span>
                </label>
                <select
                  id="content-platform"
                  className="form-control"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  disabled={submitting}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Type Dropdown */}
              <div className="form-group">
                <label htmlFor="content-type" className="form-label">
                  Content Type <span className="required-star">*</span>
                </label>
                <select
                  id="content-type"
                  className="form-control"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  disabled={submitting}
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="form-group">
                <label htmlFor="content-status" className="form-label">
                  Workflow Status <span className="required-star">*</span>
                </label>
                <select
                  id="content-status"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                  disabled={submitting}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scheduled Date */}
              <div className="form-group">
                <label htmlFor="content-date" className="form-label">
                  Scheduled Date {status === 'Scheduled' && <span className="required-star">*</span>}
                </label>
                <input
                  type="date"
                  id="content-date"
                  className={`form-control ${errors.scheduledDate ? 'has-error' : ''}`}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  disabled={submitting}
                />
                {errors.scheduledDate && <p className="form-error-msg">{errors.scheduledDate}</p>}
                <p className="form-helper">Optional unless status is Scheduled.</p>
              </div>

              {/* Production Notes */}
              <div className="form-group col-span-2">
                <label htmlFor="content-notes" className="form-label">
                  Internal Notes & Assets
                </label>
                <textarea
                  id="content-notes"
                  className="form-control"
                  placeholder="Add camera notes, resource links, hashtags, thumbnail design cues..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                />
                <p className="form-helper">Private notes for your production checklist.</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <Link to="/content" className="btn btn-secondary" tabIndex={submitting ? -1 : 0}>
                Cancel
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={submitting}
                onClick={() => handleSave('Draft')}
              >
                <FileEdit size={16} />
                <span>Save Draft</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                <Save size={16} />
                <span>{submitting ? 'Saving...' : 'Save & Publish/Schedule'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
