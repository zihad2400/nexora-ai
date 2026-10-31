import mongoose from 'mongoose';

const aiProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, enum: ['openai', 'google', 'anthropic'] },
    displayName: { type: String, required: true },
    apiKeyEncrypted: { type: String, default: '' },
    baseUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    capabilities: [{ type: String, enum: ['chat', 'vision', 'image', 'embedding', 'code', 'audio'] }],
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
aiProviderSchema.methods.toSafeJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.apiKeyEncrypted;
  obj.hasApiKey = Boolean(this.apiKeyEncrypted);
  return obj;
};
export default mongoose.models.AIProvider || mongoose.model('AIProvider', aiProviderSchema);
