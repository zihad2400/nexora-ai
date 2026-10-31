import mongoose from 'mongoose';

const aiModelSchema = new mongoose.Schema(
  {
    providerName: { type: String, required: true, enum: ['openai', 'google', 'anthropic'], index: true },
    modelId: { type: String, required: true, trim: true },
    displayName: { type: String, required: true },
    description: { type: String, default: '' },
    contextWindow: { type: Number, default: 8192 },
    maxOutputTokens: { type: Number, default: 4096 },
    capabilities: [{ type: String, enum: ['chat', 'vision', 'image', 'embedding', 'code', 'audio'] }],
    inputPricePer1k: { type: Number, default: 0 },
    outputPricePer1k: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 100 },
  },
  { timestamps: true }
);
aiModelSchema.index({ providerName: 1, modelId: 1 }, { unique: true });
aiModelSchema.index({ isActive: 1, order: 1 });
export default mongoose.models.AIModel || mongoose.model('AIModel', aiModelSchema);
