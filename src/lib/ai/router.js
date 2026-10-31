import { env } from '@/lib/env';

export const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', capabilities: ['chat', 'vision'] },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', capabilities: ['chat', 'vision'] },
  { id: 'gemini-3.8-flash', name: 'Gemini 1.5 Pro', provider: 'google', capabilities: ['chat', 'vision'] },
];

export function getProvider(modelId) {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (!model) throw new Error('Model not found');
  
  if (model.provider === 'openai' && !env.OPENAI.enabled) {
    throw new Error('OPENAI_API_KEY is missing. Please add it to your .env.local file to use this model.');
  }
  // Future: Check Google & Anthropic keys here
  
  return model;
}
