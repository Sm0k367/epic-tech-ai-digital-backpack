/**
 * Environment variable helpers
 * All env vars are optional — app works without any configuration
 */

export const env = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export const isProduction = env.nodeEnv === 'production';
export const hasOpenAI = !!env.openaiApiKey;
export const hasAnthropic = !!env.anthropicApiKey;
