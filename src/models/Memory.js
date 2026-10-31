import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['preference', 'fact', 'context'], default: 'fact', index: true },
    key: { type: String, required: true, trim: true, maxlength: 120 },
    value: { type: String, required: true, maxlength: 4000 },
    source: { type: String, default: 'manual', enum: ['manual', 'chat', 'system'] },
    sourceMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    isActive: { type: Boolean, default: true },
    tags: [String],
  },
  { timestamps: true }
);
memorySchema.index({ userId: 1, type: 1, isActive: 1 });
memorySchema.index({ userId: 1, key: 'text', value: 'text' });
export default mongoose.models.Memory || mongoose.model('Memory', memorySchema);
