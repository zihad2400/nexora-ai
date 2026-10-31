import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'document', 'audio'], required: true },
    url: { type: String, required: true },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 },
    name: { type: String, default: '' },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, default: '' },
    model: { type: String, default: '' },
    providerName: { type: String, default: '' },
    attachments: [attachmentSchema],
    tokens: {
      prompt: { type: Number, default: 0 },
      completion: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    isRegenerated: { type: Boolean, default: false },
    finishReason: { type: String, default: '' },
    error: { type: String, default: '' },
  },
  { timestamps: true }
);
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.models.Message || mongoose.model('Message', messageSchema);
