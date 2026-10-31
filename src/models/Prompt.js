import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true, maxlength: 8000 },
    category: { type: String, default: 'general' },
    tags: [String],
    isPublic: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
promptSchema.index({ userId: 1, isFavorite: -1, updatedAt: -1 });
promptSchema.index({ isPublic: 1, tags: 1 });
promptSchema.index({ title: 'text', content: 'text', tags: 'text' });
export default mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);
