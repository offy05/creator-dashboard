import { ContentItem, CreateContentInput, UpdateContentInput, DashboardStats, ContentFilterOptions } from '../types/content';
import { INITIAL_SAMPLE_CONTENT } from './mockData';

const STORAGE_KEY = 'creatorhub_content_items_v1';

class ContentService {
  private inMemoryCache: ContentItem[] | null = null;
  private listeners: Array<() => void> = [];

  private loadData(): ContentItem[] {
    if (this.inMemoryCache !== null) {
      return this.inMemoryCache;
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ContentItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.inMemoryCache = parsed;
            return this.inMemoryCache;
          }
        }
      }
    } catch (err) {
      console.warn('LocalStorage not accessible or corrupted, falling back to initial data', err);
    }

    // Default seed
    this.inMemoryCache = [...INITIAL_SAMPLE_CONTENT];
    this.saveData(this.inMemoryCache);
    return this.inMemoryCache;
  }

  private saveData(data: ContentItem[]): void {
    this.inMemoryCache = data;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error saving to localStorage', err);
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Listener callback error', e);
      }
    });
  }

  public async getAll(filters?: ContentFilterOptions): Promise<ContentItem[]> {
    // Artificial small latency for realistic loading experience
    await new Promise(r => setTimeout(r, 60));
    const items = this.loadData();

    if (!filters) {
      return [...items];
    }

    return items.filter(item => {
      if (filters.platform && filters.platform !== 'All' && item.platform !== filters.platform) {
        return false;
      }
      if (filters.status && filters.status !== 'All' && item.status !== filters.status) {
        return false;
      }
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inNotes = item.notes?.toLowerCase().includes(q) || false;
        const inType = item.contentType.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inNotes && !inType) {
          return false;
        }
      }
      return true;
    });
  }

  public async getById(id: string): Promise<ContentItem | null> {
    await new Promise(r => setTimeout(r, 40));
    const items = this.loadData();
    const found = items.find(i => i.id === id);
    return found ? { ...found } : null;
  }

  public async create(input: CreateContentInput): Promise<ContentItem> {
    await new Promise(r => setTimeout(r, 80));
    const items = this.loadData();

    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...input,
      id: `ch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newItem, ...items];
    this.saveData(updated);
    return newItem;
  }

  public async update(id: string, input: UpdateContentInput): Promise<ContentItem> {
    await new Promise(r => setTimeout(r, 80));
    const items = this.loadData();
    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
      throw new Error(`Content item with ID "${id}" not found.`);
    }

    const existing = items[index];
    const updatedItem: ContentItem = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...items];
    updatedList[index] = updatedItem;
    this.saveData(updatedList);
    return updatedItem;
  }

  public async updateStatus(id: string, status: ContentItem['status']): Promise<ContentItem> {
    return this.update(id, { status });
  }

  public async delete(id: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 60));
    const items = this.loadData();
    const filtered = items.filter(i => i.id !== id);

    if (filtered.length === items.length) {
      return false;
    }

    this.saveData(filtered);
    return true;
  }

  public async getStats(): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 40));
    const items = this.loadData();

    return {
      total: items.length,
      drafts: items.filter(i => i.status === 'Draft').length,
      published: items.filter(i => i.status === 'Published').length,
      scheduled: items.filter(i => i.status === 'Scheduled').length,
      ideas: items.filter(i => i.status === 'Idea').length,
    };
  }

  public async resetToSampleData(): Promise<ContentItem[]> {
    await new Promise(r => setTimeout(r, 60));
    const resetList = [...INITIAL_SAMPLE_CONTENT];
    this.saveData(resetList);
    return resetList;
  }
}

export const contentService = new ContentService();
