import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Settings, Sparkles, X } from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-label="Close menu backdrop"
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="brand-logo" onClick={onCloseMobile}>
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <span className="brand-title">CreatorHub</span>
          </NavLink>
          {mobileOpen && (
            <button
              type="button"
              className="btn-icon-only mobile-menu-btn"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onCloseMobile}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/content"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onCloseMobile}
          >
            <FileText size={18} />
            <span>Content</span>
          </NavLink>

          <NavLink
            to="/content/new"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onCloseMobile}
          >
            <PlusCircle size={18} />
            <span>Create Content</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onCloseMobile}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar-wrapper">
              <div className="user-avatar">TU</div>
              <span className="online-indicator" title="Online" aria-label="Online status indicator" />
            </div>
            <div className="user-info">
              <span className="user-name">Test User</span>
              <span className="user-status">
                Creator Pro &bull; Online
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
