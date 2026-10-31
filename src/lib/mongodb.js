import mongoose from 'mongoose';
import { env } from './env';

if (!env.MONGODB_URI) {
  throw new Error('[mongodb] MONGODB_URI is not set. See .env.example');
}

let cached = global.__nexoraMongoose;
if (!cached) cached = global.__nexoraMongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(env.MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
      })
      .then((m) => {
        if (env.NODE_ENV !== 'production') console.log('[mongodb] connected');
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

export async function disconnectDB() {
  if (!cached.conn) return;
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
}
