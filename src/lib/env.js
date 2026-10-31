const REQUIRED = ['MONGODB_URI', 'JWT_SECRET'];
const OPTIONAL_AI_KEYS = ['OPENAI_API_KEY', 'GOOGLE_AI_API_KEY', 'ANTHROPIC_API_KEY'];

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(
    `[env] Missing required environment variable(s): ${missing.join(', ')}. Check .env.local (see .env.example).`
  );
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'NEXORA AI',

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: process.env.COOKIE_NAME || 'nexora_session',

  OPENAI: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    enabled: Boolean(process.env.OPENAI_API_KEY),
  },
  GEMINI: {
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
    enabled: Boolean(process.env.GOOGLE_AI_API_KEY),
  },
  ANTHROPIC: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    enabled: Boolean(process.env.ANTHROPIC_API_KEY),
  },

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',

  RATE_LIMIT: {
    windowSeconds: Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 30),
  },

  aiStatus() {
    return OPTIONAL_AI_KEYS.reduce((acc, k) => {
      acc[k] = Boolean(process.env[k]);
      return acc;
    }, {});
  },
};
