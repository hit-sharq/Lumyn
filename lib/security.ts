// Edge/runtime-compatible HMAC verification using Web Crypto API
export async function verifyHmac({
  payload,
  secret,
  algorithm = 'SHA-256',
  signature,
}: {
  payload: string | Uint8Array
  secret: string
  algorithm?: string
  signature?: string | null
}): Promise<boolean> {
  if (!signature) return false

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const subtleAlg = { name: 'HMAC', hash: { name: algorithm } }

  const key = await (globalThis.crypto as any).subtle.importKey(
    'raw',
    keyData,
    subtleAlg,
    false,
    ['sign']
  )

  const data = typeof payload === 'string' ? encoder.encode(payload) : payload
  const sigBuffer = await (globalThis.crypto as any).subtle.sign('HMAC', key, data)
  const sigBytes = new Uint8Array(sigBuffer)

  const hex = Array.from(sigBytes).map((b) => b.toString(16).padStart(2, '0')).join('')

  // base64 conversion (works in browser/edge runtimes)
  let base64 = ''
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(sigBytes).toString('base64')
  } else if (typeof btoa !== 'undefined') {
    let binary = ''
    for (let i = 0; i < sigBytes.length; i++) binary += String.fromCharCode(sigBytes[i])
    base64 = btoa(binary)
  }

  const cleaned = signature.replace(/^sha256=|^sha1=|^/, '')

  return cleaned === hex || !!(base64 && cleaned === base64)
}

// Simple in-memory rate limiter: max `limit` requests per `windowMs` per key
const rateStore = new Map<string, { count: number; windowStart: number }>()

export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now()
  const entry = rateStore.get(key)
  if (!entry) {
    rateStore.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: limit - 1 }
  }

  if (now - entry.windowStart > windowMs) {
    rateStore.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count += 1
  rateStore.set(key, entry)
  return { allowed: true, remaining: limit - entry.count }
}

export function clearRateLimit() {
  rateStore.clear()
}
