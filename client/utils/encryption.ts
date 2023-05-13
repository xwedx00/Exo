import ecc from 'elliptic';
import aes from 'aes-js';
import { getPrivateKey } from './keyManagement';

// Define elliptic curve cryptography object for key generation and signing
const ec = new ecc.ec('secp256k1');

// Generate symmetric encryption key using provided passphrase
export function generateKey(passphrase: string): Uint8Array {
  const hash = aes.utils.utf8.toBytes(passphrase);
  const key = aes.utils.pbkdf2(hash, hash, 1000, 32);
  return key;
}

// Encrypt data using provided key
export function encryptData(data: string, key: Uint8Array): string {
  const aesCtr = new aes.ModeOfOperation.ctr(key);
  const encryptedBytes = aesCtr.encrypt(aes.utils.utf8.toBytes(data));
  const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

// Decrypt data using provided key
export function decryptData(data: string, key: Uint8Array): string {
  const encryptedBytes = aes.utils.hex.toBytes(data);
  const aesCtr = new aes.ModeOfOperation.ctr(key);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

// Generate elliptic curve cryptography key pair
export function generateEccKeyPair(): ecc.KeyPair {
  return ec.genKeyPair();
}

// Sign data using private key
export function signData(data: string, privateKey: string): string {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature = key.sign(data);
  const signatureHex = signature.toDER('hex');
  return signatureHex;
}

// Verify signature using public key
export function verifySignature(data: string, signature: string, publicKey: string): boolean {
  const key = ec.keyFromPublic(publicKey, 'hex');
  const signatureDer = Buffer.from(signature, 'hex');
  return key.verify(data, signatureDer);
}

// Encrypt data using recipient's public key
export function encryptDataWithPublicKey(data: string, publicKey: string): string {
  const key = ec.keyFromPublic(publicKey, 'hex');
  const sharedKey = getPrivateKey().derive(key.getPublic());
  const sharedKeyBytes = sharedKey.toArray('be');
  const encryptedHex = encryptData(data, sharedKeyBytes);
  return encryptedHex;
}

// Decrypt data using recipient's public key
export function decryptDataWithPublicKey(data: string, publicKey: string): string {
  const key = ec.keyFromPublic(publicKey, 'hex');
  const sharedKey = key.derive(getPrivateKey().getPrivate());
  const sharedKeyBytes = sharedKey.toArray('be');
  const decryptedText = decryptData(data, sharedKeyBytes);
  return decryptedText;
}
