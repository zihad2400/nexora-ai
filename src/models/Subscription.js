import mongoose from 'mongoose';

const planLimits = {
  free: { chats: 100, images: 10, documents: 5, tokens: 50_000 },
  pro: { chats: 5_000, images: 500, documents: 100, tokens: 2_000_000 },
  premium: { chats: 25_000, images: 5_000, documents: 1_000, tokens: 10_000_000 },
  enterprise: { chats: -1, images: -1, documents: -1, tokens: -1 },
};

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['free', 'pro', 'premium', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'trial', 'cancelled', 'expired', 'past_due'], default: 'active' },
    currentPeriodStart: { type: Date, default: Date.now },
    currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    limits: { type: mongoose.Schema.Types.Mixed, default: () => planLimits.free },
    usage: {
      chats: { type: Number, default: 0 },
      images: { type: Number, default: 0 },
      documents: { type: Number, default: 0 },
      tokens: { type: Number, default: 0 },
    },
    paymentProvider: { type: String, default: '' },
    providerSubscriptionId: { type: String, default: '' },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);
subscriptionSchema.statics.planLimits = planLimits;
export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
