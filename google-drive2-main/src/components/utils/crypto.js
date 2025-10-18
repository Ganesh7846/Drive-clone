// src/utils/crypto.js
// AES-GCM + PBKDF2 (Web Crypto). No external deps.

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Random bytes → base64
function b64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

// base64 → Uint8Array
function b64ToBytes(b64str) {
  const bin = atob(b64str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase, saltBytes, iterations = 250000) {
  const passKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: saltBytes,
      iterations,
    },
    passKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFile(file, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const plainBuf = await file.arrayBuffer();
  const cipherBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plainBuf
  );

  const encryptedBlob = new Blob([cipherBuf], { type: "application/octet-stream" });

  return {
    encryptedBlob,
    meta: {
      alg: "AES-GCM",
      salt_b64: b64(salt),
      iv_b64: b64(iv),
      kdf: "PBKDF2-SHA256",
      iters: 250000,
      originalName: file.name,
      originalType: file.type || "application/octet-stream",
      originalSize: file.size,
    },
  };
}

export async function decryptBytes(cipherBytes, passphrase, meta) {
  const salt = b64ToBytes(meta.salt_b64);
  const iv = b64ToBytes(meta.iv_b64);
  const key = await deriveKey(passphrase, salt, meta.iters);

  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherBytes
  );
  return new Uint8Array(plainBuf);
}
