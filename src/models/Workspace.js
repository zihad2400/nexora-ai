import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: '', maxlength: 500 },
    icon: { type: String, default: '📁' },
    color: { type: String, default: '#7c5cff' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);
workspaceSchema.index({ userId: 1, isDefault: -1 });
workspaceSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.models.Workspace || mongoose.model('Workspace', workspaceSchema);
