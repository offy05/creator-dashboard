# CreatorHub - Creator Content Dashboard

A modern, responsive social media content management dashboard designed for creators to plan, draft, schedule, and track content across multiple platforms (Instagram, YouTube, TikTok, X, and Facebook).

## Features

- **Creator Dashboard (`/`)**: Overview metrics for total ideas, drafts, scheduled posts, published content, and raw concepts, with a quick recent content feed.
- **Content Library (`/content`)**: Full content catalog with real-time text search, platform filtering, status filtering, and delete confirmation dialogs.
- **Content Creation (`/content/new`)**: Production form with input validation, platform selection, content formats, scheduling date pickers, and workflow notes.
- **Content Details & Edit (`/content/:id`)**: Comprehensive post inspector, inline editing mode, quick one-click status transitions, and item metadata.
- **Workspace Settings (`/settings`)**: Diagnostics overview and sample dataset reset tool.
- **Data Layer**: LocalStorage persistence with reactive event subscription.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 6
- **Routing**: React Router DOM 6
- **Icons**: Lucide React
- **Styling**: Vanilla CSS design system with Plus Jakarta Sans typography

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/offy05/creator-dashboard.git

# Navigate to project directory
cd creator-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000/`.

### Build for Production

```bash
npm run build
```
