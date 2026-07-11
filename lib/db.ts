import mongoose from "mongoose";

/**
 * Cached Mongoose connection for Next.js serverless environments.
 *
 * Route handlers and server components are bundled separately and hot-reloaded
 * in dev, so a plain module-level connection would open a new pool on every
 * invocation and exhaust Atlas's connection limit. Caching the connection
 * (and the in-flight promise) on `globalThis` guarantees a single pool per
 * runtime process. Every data access in the app must go through this helper.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalThis.mongooseCache = cached;

export default async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Read lazily (not at module scope) so scripts can load dotenv first.
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "Missing MONGODB_URI environment variable — copy .env.example to .env.local and set it."
      );
    }
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next call can retry instead of awaiting a rejected promise.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
