/**
 * API Helper Functions
 * Reusable functions for making API calls with proper error handling
 */

import { apiConfig, APIKeyMissingError } from './api-config';

// Generic API error class
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// OpenAI API Helpers
export const openai = {
  async chat(messages: Array<{ role: string; content: string }>, options: any = {}) {
    if (!apiConfig.openai.isConfigured()) {
      throw new APIKeyMissingError('OpenAI');
    }

    try {
      const response = await fetch(`${apiConfig.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || apiConfig.openai.defaultModel,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          ...options,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new APIError(
          error.error?.message || 'OpenAI API request failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError || error instanceof APIKeyMissingError) {
        throw error;
      }
      throw new APIError(`OpenAI request failed: ${(error as Error).message}`);
    }
  },

  async completion(prompt: string, options: any = {}) {
    return this.chat([{ role: 'user', content: prompt }], options);
  },
};

// Anthropic API Helpers
export const anthropic = {
  async message(messages: Array<{ role: string; content: string }>, options: any = {}) {
    if (!apiConfig.anthropic.isConfigured()) {
      throw new APIKeyMissingError('Anthropic');
    }

    try {
      const response = await fetch(`${apiConfig.anthropic.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiConfig.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: options.model || apiConfig.anthropic.defaultModel,
          messages,
          max_tokens: options.maxTokens || 1024,
          ...options,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new APIError(
          error.error?.message || 'Anthropic API request failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError || error instanceof APIKeyMissingError) {
        throw error;
      }
      throw new APIError(`Anthropic request failed: ${(error as Error).message}`);
    }
  },

  async completion(prompt: string, options: any = {}) {
    return this.message([{ role: 'user', content: prompt }], options);
  },
};

// Replicate API Helpers
export const replicate = {
  async predict(model: string, input: any, options: any = {}) {
    if (!apiConfig.replicate.isConfigured()) {
      throw new APIKeyMissingError('Replicate');
    }

    try {
      const response = await fetch(`${apiConfig.replicate.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${apiConfig.replicate.apiToken}`,
        },
        body: JSON.stringify({
          version: model,
          input,
          ...options,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new APIError(
          error.detail || 'Replicate API request failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError || error instanceof APIKeyMissingError) {
        throw error;
      }
      throw new APIError(`Replicate request failed: ${(error as Error).message}`);
    }
  },

  async getPrediction(predictionId: string) {
    if (!apiConfig.replicate.isConfigured()) {
      throw new APIKeyMissingError('Replicate');
    }

    try {
      const response = await fetch(
        `${apiConfig.replicate.baseUrl}/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${apiConfig.replicate.apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new APIError('Failed to get prediction status', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError || error instanceof APIKeyMissingError) {
        throw error;
      }
      throw new APIError(`Replicate status check failed: ${(error as Error).message}`);
    }
  },
};

// GitHub API Helpers
export const github = {
  async request(endpoint: string, options: any = {}) {
    if (!apiConfig.github.isConfigured()) {
      throw new APIKeyMissingError('GitHub');
    }

    try {
      const response = await fetch(`${apiConfig.github.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${apiConfig.github.token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new APIError(
          error.message || 'GitHub API request failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError || error instanceof APIKeyMissingError) {
        throw error;
      }
      throw new APIError(`GitHub request failed: ${(error as Error).message}`);
    }
  },

  async getRepo(owner: string, repo: string) {
    return this.request(`/repos/${owner}/${repo}`);
  },

  async createRepo(name: string, options: any = {}) {
    return this.request('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        private: options.private || false,
        description: options.description || '',
        ...options,
      }),
    });
  },

  async listRepos(options: any = {}) {
    return this.request('/user/repos', {
      method: 'GET',
    });
  },
};

// Supabase helpers (client-side)
export const createSupabaseClient = () => {
  if (!apiConfig.supabase.isConfigured()) {
    throw new APIKeyMissingError('Supabase');
  }

  // Note: In a real implementation, you'd use @supabase/supabase-js
  // This is a placeholder for the configuration
  return {
    url: apiConfig.supabase.url,
    anonKey: apiConfig.supabase.anonKey,
  };
};

// Utility function to handle API errors gracefully
export const handleAPIError = (error: unknown): string => {
  if (error instanceof APIKeyMissingError) {
    return `Configuration Error: ${error.message}. Please check API_SETUP.md for instructions.`;
  }

  if (error instanceof APIError) {
    return `API Error: ${error.message}${error.statusCode ? ` (Status: ${error.statusCode})` : ''}`;
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return 'An unknown error occurred';
};

// Retry logic for API calls
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on configuration errors
      if (error instanceof APIKeyMissingError) {
        throw error;
      }

      // Don't retry on 4xx errors (except 429 rate limit)
      if (error instanceof APIError && error.statusCode) {
        if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
          throw error;
        }
      }

      // Wait before retrying with exponential backoff
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
