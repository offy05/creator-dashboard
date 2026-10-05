import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/content') return 'Content Library';
    if (path === '/content/new') return 'Create New Content';
    if (path.startsWith('/content/')) return 'Content Details & Edit';
    if (path === '/settings') return 'Workspace Settings';
    return 'CreatorHub';
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <span className="page-title">{getPageTitle()}</span>
      </div>

      <div className="header-right">
        {location.pathname !== '/content/new' && (
          <Link to="/content/new" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Create Content</span>
          </Link>
        )}
      </div>
    </header>
  );
};
