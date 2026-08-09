import mongoose from "mongoose";
import dns from "node:dns";

const DNS_SERVERS = (process.env.DNS_SERVERS ?? "").split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

const FALLBACK_DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];
const effectiveDnsServers = DNS_SERVERS.length > 0 ? DNS_SERVERS : FALLBACK_DNS_SERVERS;

try {
  dns.setServers(effectiveDnsServers);
} catch {
  // keep the platform default servers if the override is invalid
}

console.error(`[db] DNS_SERVERS=${JSON.stringify(DNS_SERVERS)} effectiveServers=${JSON.stringify(dns.getServers())}`);

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __mongooseGlobal: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.__mongooseGlobal ?? {
  conn: null,
  promise: null,
};

if (!globalThis.__mongooseGlobal) {
  globalThis.__mongooseGlobal = cached;
}

async function resolveSrvRecords(host: string) {
  const originalServers = dns.getServers();
  try {
    const records = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
    return records
      .sort((a, b) => a.priority - b.priority || a.weight - b.weight)
      .map((r) => `${r.name}:${r.port}`);
  } catch (error) {
    console.error(`[db] SRV lookup failed for ${host} using DNS servers ${JSON.stringify(originalServers)}:`, error);
    dns.setServers(FALLBACK_DNS_SERVERS);
    const records = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
    dns.setServers(originalServers);
    return records
      .sort((a, b) => a.priority - b.priority || a.weight - b.weight)
      .map((r) => `${r.name}:${r.port}`);
  }
}

async function resolveTxtRecords(host: string) {
  try {
    const records = await dns.promises.resolveTxt(host);
    return (records.flat() as string[])
      .flatMap((entry) => entry.split("&"))
      .filter(
        (t) => t.startsWith("authSource") || t.startsWith("replicaSet")
      );
  } catch {
    return [];
  }
}

async function resolveDirectUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const [head, queryPart] = uri.split("?");
  const match = head.match(/^mongodb\+srv:\/\/(?:([^@]+)@)?([^/:]+)(.*)$/);
  if (!match) return uri;

  const creds = match[1] ?? "";
  const host = match[2];
  const pathPart = match[3] ?? "";

  const hosts = await resolveSrvRecords(host);
  const txt = await resolveTxtRecords(host);

  const params = new URLSearchParams();
  txt.forEach((entry) => {
    const eq = entry.indexOf("=");
    if (eq > 0) params.set(entry.slice(0, eq), entry.slice(eq + 1));
  });
  params.set("tls", "true");
  if (!params.has("retryWrites")) params.set("retryWrites", "true");
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((value, key) => params.set(key, value));
  }

  const credentials = creds ? `${creds}@` : "";
  const dbPart = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  return `mongodb://${credentials}${hosts.join(",")}${dbPart}?${params.toString()}`;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable (e.g. in .env)"
    );
  }
  return uri;
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const rawUri = getMongoUri();
    const mongoUri = rawUri.startsWith("mongodb+srv://") ? await resolveDirectUri(rawUri) : rawUri;
    // console.error(`[db] resolvedUri=${mongoUri}`);
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}