import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['chat', 'image', 'vision', 'embedding', 'document', 'audio'], required: true, index: true },
    provider: { type: String, required: true },
    model: { type: String, required: true },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeneratedImage' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
usageLogSchema.index({ userId: 1, createdAt: -1 });
usageLogSchema.index({ userId: 1, type: 1, createdAt: -1 });
export default mongoose.models.UsageLog || mongoose.model('UsageLog', usageLogSchema);
