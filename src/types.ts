/**
 * Common type definitions for Gnoixus extension
 */

export interface PasswordEntry {
  site: string;
  username: string;
  encrypted: string;
  createdAt: number;
  updatedAt: number;
}

export interface PasswordStore {
  [site: string]: PasswordEntry;
}

export interface GitHubSearchResult {
  items: GitHubUser[] | GitHubRepository[];
  total_count: number;
  incomplete_results: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface LinterResult {
  success: boolean;
  formatted?: string;
  errors?: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

export interface FeatureConfig {
  darkMode?: {
    intensity: number;
  };
  linterFormatter?: {
    autoFormat: boolean;
    languages: string[];
  };
  githubSearch?: {
    cacheResults: boolean;
    resultsLimit: number;
  };
  passwordManager?: {
    autoLock: boolean;
    lockTimeout: number;
  };
}
