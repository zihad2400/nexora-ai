import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'BDT' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'], default: 'pending', index: true },
    provider: { type: String, default: 'sslcommerz' },
    providerPaymentId: { type: String, default: '', index: true },
    providerData: { type: mongoose.Schema.Types.Mixed, default: {} },
    plan: { type: String, enum: ['pro', 'premium', 'enterprise'] },
    completedAt: { type: Date },
    failureReason: { type: String, default: '' },
  },
  { timestamps: true }
);
paymentSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
