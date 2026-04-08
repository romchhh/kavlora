const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  clientId: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean } {
  const now = Date.now();
  let bucket = rateBuckets.get(clientId);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    rateBuckets.set(clientId, bucket);
  }
  bucket.count += 1;
  if (bucket.count > maxRequests) {
    return { allowed: false };
  }
  return { allowed: true };
}

const DANGEROUS = /<script|javascript:|on\w+\s*=|<\?php/i;

export function containsDangerousPatterns(text: string): boolean {
  return DANGEROUS.test(text);
}
