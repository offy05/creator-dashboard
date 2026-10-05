export type Platform = 'Facebook' | 'Instagram' | 'YouTube' | 'TikTok' | 'X';

export type ContentType = 'Reel' | 'Image' | 'Meme' | 'Short' | 'Text';

export type ContentStatus = 'Idea' | 'Draft' | 'Scheduled' | 'Published';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  contentType: ContentType;
  status: ContentStatus;
  scheduledDate: string; // YYYY-MM-DD or ISO string
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateContentInput = Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateContentInput = Partial<CreateContentInput>;

export interface DashboardStats {
  total: number;
  drafts: number;
  published: number;
  scheduled: number;
  ideas: number;
}

export interface ContentFilterOptions {
  searchQuery?: string;
  platform?: Platform | 'All';
  status?: ContentStatus | 'All';
}
