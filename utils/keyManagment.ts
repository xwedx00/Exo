import crypto from 'crypto';

const KEY_SIZE = 32;
const IV_SIZE = 16;
const ALGORITHM = 'aes-256-cbc';

export function generateRandomKey(): string {
  return crypto.randomBytes(KEY_SIZE).toString('hex');
}

export function encryptWithKey(key: string, data: string): { iv: string; encryptedData: string } {
  const iv = crypto.randomBytes(IV_SIZE).toString('hex');
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  const encrypted = cipher.update(data);
  const final = cipher.final();
  const encryptedData = Buffer.concat([encrypted, final]).toString('hex');
  return { iv, encryptedData };
}

export function decryptWithKey(key: string, iv: string, encryptedData: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
}

export function generateKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
  });
  return {
    publicKey: publicKey.export({ type: 'spki', format: 'pem' }).toString(),
    privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  };
}

export function encryptWithPublicKey(publicKey: string, data: string): string {
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(data));
  return encrypted.toString('base64');
}

export function decryptWithPrivateKey(privateKey: string, encryptedData: string): string {
  const decrypted = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
  return decrypted.toString();
}

export function signData(privateKey: string, data: string): string {
  const signer = crypto.createSign('SHA256');
  signer.update(data);
  const signature = signer.sign(privateKey, 'hex');
  return signature;
}

export function verifyData(publicKey: string, data: string, signature: string): boolean {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(data);
  return verifier.verify(publicKey, signature, 'hex');
}
