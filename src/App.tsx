import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { ContentList } from './pages/ContentList';
import { CreateContent } from './pages/CreateContent';
import { ContentDetail } from './pages/ContentDetail';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Responsive Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Application Area */}
        <div className="main-layout">
          <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/content" element={<ContentList />} />
              <Route path="/content/new" element={<CreateContent />} />
              <Route path="/content/:id" element={<ContentDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};
export default App;
