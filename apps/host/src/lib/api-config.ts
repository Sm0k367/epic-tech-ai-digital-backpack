/**
 * API Configuration and Utility Functions
 * Centralized API key management and helper functions
 */

// Environment variable validation
export const validateEnv = () => {
  const warnings: string[] = [];
  
  if (!process.env.OPENAI_API_KEY) {
    warnings.push('OPENAI_API_KEY is not set - Chat Nexus will not work');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    warnings.push('Supabase credentials missing - Database features disabled');
  }
  
  if (!process.env.REPLICATE_API_TOKEN) {
    warnings.push('REPLICATE_API_TOKEN is not set - Music Vault will not work');
  }
  
  if (!process.env.GITHUB_TOKEN) {
    warnings.push('GITHUB_TOKEN is not set - Code Vault will not work');
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  API Configuration Warnings:');
    warnings.forEach(w => console.warn(`   - ${w}`));
    console.warn('   See API_SETUP.md for configuration instructions');
  }
  
  return warnings.length === 0;
};

// API Configuration object
export const apiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4',
    isConfigured: () => !!process.env.OPENAI_API_KEY,
  },
  
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-opus-20240229',
    isConfigured: () => !!process.env.ANTHROPIC_API_KEY,
  },
  
  replicate: {
    apiToken: process.env.REPLICATE_API_TOKEN || '',
    baseUrl: 'https://api.replicate.com/v1',
    isConfigured: () => !!process.env.REPLICATE_API_TOKEN,
  },
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isConfigured: () => !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },
  
  github: {
    token: process.env.GITHUB_TOKEN || '',
    baseUrl: 'https://api.github.com',
    isConfigured: () => !!process.env.GITHUB_TOKEN,
  },
};

// Error classes for better error handling
export class APIConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIConfigError';
  }
}

export class APIKeyMissingError extends APIConfigError {
  constructor(service: string) {
    super(`${service} API key is not configured. Please check your .env.local file.`);
    this.name = 'APIKeyMissingError';
  }
}

// Helper function to check if a service is configured
export const isServiceConfigured = (service: keyof typeof apiConfig): boolean => {
  return apiConfig[service].isConfigured();
};

// Helper function to get API key with validation
export const getApiKey = (service: keyof typeof apiConfig): string => {
  const config = apiConfig[service];
  
  if (!config.isConfigured()) {
    throw new APIKeyMissingError(service);
  }
  
  if ('apiKey' in config) {
    return config.apiKey;
  }
  
  if ('apiToken' in config) {
    return config.apiToken;
  }
  
  if ('token' in config) {
    return config.token;
  }
  
  throw new APIConfigError(`Unable to retrieve API key for ${service}`);
};

// Feature flags based on API configuration
export const features = {
  chatNexus: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_CHAT_NEXUS !== 'false' && 
             (apiConfig.openai.isConfigured() || apiConfig.anthropic.isConfigured()),
    name: 'Chat Nexus',
  },
  
  musicVault: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_MUSIC_VAULT !== 'false' && 
             apiConfig.replicate.isConfigured(),
    name: 'Music Vault',
  },
  
  codeVault: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_CODE_VAULT !== 'false' && 
             apiConfig.github.isConfigured(),
    name: 'Code Vault',
  },
  
  gameLabs: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_GAME_LABS !== 'false',
    name: 'Game Labs',
  },
};

// Get list of disabled features
export const getDisabledFeatures = (): string[] => {
  return Object.entries(features)
    .filter(([_, feature]) => !feature.enabled)
    .map(([_, feature]) => feature.name);
};

// Validate all required APIs for a feature
export const validateFeature = (feature: keyof typeof features): boolean => {
  return features[feature].enabled;
};

// Export configuration status for debugging
export const getConfigStatus = () => {
  return {
    openai: apiConfig.openai.isConfigured(),
    anthropic: apiConfig.anthropic.isConfigured(),
    replicate: apiConfig.replicate.isConfigured(),
    supabase: apiConfig.supabase.isConfigured(),
    github: apiConfig.github.isConfigured(),
    features: {
      chatNexus: features.chatNexus.enabled,
      musicVault: features.musicVault.enabled,
      codeVault: features.codeVault.enabled,
      gameLabs: features.gameLabs.enabled,
    },
  };
};
