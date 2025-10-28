import { Feature, Logger, StorageManager, MessageBus } from '../../utils';
import type { GitHubSearchResult, GitHubUser, GitHubRepository } from '../../types';

/**
 * GitHub Search Feature - Search for users and repositories
 */
export class GithubSearchFeature implements Feature {
  name = 'githubSearch';
  enabled = true;
  private apiBase = 'https://api.github.com';
  private cacheResults = true;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async init(): Promise<void> {
    Logger.log('Initializing GitHub Search feature');
    this.enabled = await StorageManager.getFeatureState(this.name);
    
    // Listen for search requests from popup
    MessageBus.onMessage(async (message) => {
      if (message.feature === this.name && message.type === 'search') {
        return await this.handleSearch(message.data);
      }
    });
  }

  toggle(enable: boolean): void {
    this.enabled = enable;
    StorageManager.setFeatureState(this.name, enable);
  }

  private async handleSearch(data: {
    query: string;
    type: 'users' | 'repositories';
  }): Promise<GitHubSearchResult | null> {
    if (!this.enabled) return null;

    const { query, type } = data;
    return await this.search(query, type);
  }

  async search(
    query: string,
    type: 'users' | 'repositories'
  ): Promise<GitHubSearchResult | null> {
    if (!query) {
      Logger.warn('Empty search query');
      return null;
    }

    // Check cache
    const cacheKey = `${type}:${query}`;
    if (this.cacheResults) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        Logger.log('Returning cached results');
        return cached.data;
      }
    }

    try {
      const url = `${this.apiBase}/search/${type}?q=${encodeURIComponent(query)}&per_page=10`;
      
      // Try with authentication if available
      const token = await this.getAuthToken();
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json'
      };
      
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        if (response.status === 403) {
          Logger.warn('GitHub API rate limit exceeded');
          return null;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubSearchResult = await response.json();
      
      // Cache results
      if (this.cacheResults) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      Logger.log(`Found ${data.total_count} results for "${query}"`);
      return data;
    } catch (error) {
      Logger.error('GitHub search error:', error);
      return null;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    // Try to get stored token
    // Note: In production, use chrome.identity.getAuthToken for OAuth
    const token = await StorageManager.get<string>('github_token');
    return token;
  }

  async setAuthToken(token: string): Promise<void> {
    await StorageManager.set('github_token', token);
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
    Logger.log('GitHub search cache cleared');
  }

  getPopupContent(): string {
    return `
      <div class="feature-section github-search">
        <div class="search-controls">
          <input 
            type="text" 
            id="github-query" 
            placeholder="Search GitHub..."
            class="search-input"
          >
          <select id="github-type" class="search-type">
            <option value="repositories">Repositories</option>
            <option value="users">Users</option>
          </select>
          <button id="github-search-btn" class="action-btn">Search</button>
        </div>
        <div id="github-results" class="search-results"></div>
      </div>
    `;
  }

  formatUserResult(user: GitHubUser): string {
    return `
      <div class="result-item user">
        <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
        <div class="result-info">
          <a href="${user.html_url}" target="_blank" class="result-name">${user.login}</a>
          <span class="result-meta">${user.type}</span>
        </div>
      </div>
    `;
  }

  formatRepoResult(repo: GitHubRepository): string {
    return `
      <div class="result-item repo">
        <div class="result-info">
          <a href="${repo.html_url}" target="_blank" class="result-name">${repo.full_name}</a>
          <p class="result-description">${repo.description || 'No description'}</p>
          <div class="result-meta">
            ${repo.language ? `<span class="language">${repo.language}</span>` : ''}
            <span class="stars">⭐ ${repo.stargazers_count}</span>
          </div>
        </div>
      </div>
    `;
  }

  cleanup(): void {
    this.clearCache();
  }
}
