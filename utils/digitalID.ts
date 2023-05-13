import { randomBytes } from 'crypto';

const DIGITAL_ID_LENGTH = 16;

/**
 * Generates a random digital ID for a user
 * @returns {string} the generated digital ID
 */
export function generateDigitalId(): string {
  const buffer = randomBytes(DIGITAL_ID_LENGTH);
  return buffer.toString('hex');
}
