import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { ConfirmModal } from '../components/ConfirmModal';
import { Check, RotateCcw, Database, Cpu } from 'lucide-react';

export const Settings: React.FC = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checkData = async () => {
    const items = await contentService.getAll();
    setTotalCount(items.length);
  };

  useEffect(() => {
    checkData();
  }, []);

  const handleResetData = async () => {
    try {
      await contentService.resetToSampleData();
      await checkData();
      setResetModalOpen(false);
      setToastMessage('Sample dataset was successfully reseeded!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to reset dataset', err);
    }
  };

  return (
    <div style={{ maxWidth: 840 }}>
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

      <div style={{ marginBottom: 20 }}>
        <h1 className="section-title">Settings & Diagnostics</h1>
        <p className="section-subtitle">
          Manage local storage mock database and verify your Antigravity development environment status.
        </p>
      </div>

      {/* Environment Status Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={18} color="var(--primary)" />
            <h2 className="card-title">Development Environment Health</h2>
          </div>
          <span className="badge badge-status-published">
            <span className="badge-dot" />
            Verified Healthy
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Application Name</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Test web app for Antigravity environment verification</div>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>CreatorHub v1.0.0</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Stack Runtime</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>React 18 &bull; Vite 6 &bull; TypeScript 5 &bull; React Router 6</div>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--accent-emerald)' }}>Active & Hot-Reloading</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Data Persistence Layer</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Client-side LocalStorage repository with reactive service event-bus</div>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>{totalCount} Content Items Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={18} color="var(--accent-amber)" />
            <h2 className="card-title">Mock Data & Reset Tools</h2>
          </div>
        </div>
        <div className="card-body">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Need to return the content repository back to its clean test state? Click below to restore all default 9 multi-platform sample content ideas.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setResetModalOpen(true)}
          >
            <RotateCcw size={16} />
            <span>Reset to Initial Sample Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title="Reset Content Database?"
        message="This will overwrite all current changes and restore the 9 default realistic creator ideas across Instagram, YouTube, TikTok, X, and Facebook."
        confirmLabel="Reset All Data"
        cancelLabel="Cancel"
        isDestructive={false}
        onConfirm={handleResetData}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};
