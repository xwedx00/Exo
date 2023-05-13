import { generateRSAKeyPair, importRSAKey, RSAKey } from "./encryption";
import { getDigitalId, saveDigitalId } from "./digitalId";

const KEY_STORAGE_KEY = "keypair";
const PUBLIC_KEY_STORAGE_KEY = "publicKey";

// Generates a new RSA key pair and saves it in localStorage
export function generateKeyPair(): RSAKey {
  const keyPair = generateRSAKeyPair();
  const publicKey = keyPair.publicKey;

  localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(keyPair));
  localStorage.setItem(PUBLIC_KEY_STORAGE_KEY, publicKey);

  return keyPair.privateKey;
}

// Gets the user's private RSA key from localStorage
export function getPrivateKey(): RSAKey | null {
  const keyPairString = localStorage.getItem(KEY_STORAGE_KEY);

  if (keyPairString) {
    const keyPair = JSON.parse(keyPairString);
    return importRSAKey(keyPair.privateKey);
  } else {
    return null;
  }
}

// Gets the user's public RSA key from localStorage
export function getPublicKey(): string | null {
  return localStorage.getItem(PUBLIC_KEY_STORAGE_KEY);
}

// Gets the user's DigitalID
export function getMyDigitalId(): string | null {
  return getDigitalId();
}

// Saves the user's DigitalID
export function saveMyDigitalId(digitalId: string) {
  saveDigitalId(digitalId);
}
