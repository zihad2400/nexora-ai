import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', index: true },
    title: { type: String, default: 'New Conversation', maxlength: 200 },
    model: { type: String, required: true },
    providerName: { type: String, required: true },
    systemPrompt: { type: String, default: '' },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    messageCount: { type: Number, default: 0 },
    lastMessageAt: { type: Date, default: Date.now },
    tags: [String],
  },
  { timestamps: true }
);
conversationSchema.index({ userId: 1, lastMessageAt: -1 });
conversationSchema.index({ userId: 1, isPinned: -1, lastMessageAt: -1 });
conversationSchema.index({ userId: 1, title: 'text', tags: 'text' });
export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
