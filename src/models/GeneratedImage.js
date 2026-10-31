import mongoose from 'mongoose';

const generatedImageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', index: true },
    prompt: { type: String, required: true, maxlength: 4000 },
    enhancedPrompt: { type: String, default: '' },
    model: { type: String, required: true },
    providerName: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    width: { type: Number, default: 1024 },
    height: { type: Number, default: 1024 },
    status: { type: String, enum: ['queued', 'generating', 'ready', 'failed'], default: 'queued' },
    error: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
generatedImageSchema.index({ userId: 1, createdAt: -1 });
generatedImageSchema.index({ userId: 1, status: 1 });
export default mongoose.models.GeneratedImage || mongoose.model('GeneratedImage', generatedImageSchema);
