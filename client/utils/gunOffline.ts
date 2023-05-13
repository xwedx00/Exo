import Gun, { GunStatic } from "gun";
import "gun/lib/then";

/**
 * Initializes Gun.js with offline-first functionality and sets up
 * IndexedDB as the local storage engine.
 * @param user Private key of the current user.
 * @returns A Gun instance.
 */
export function initializeGunOffline(user: string): GunStatic {
  const gun = Gun({
    localStorage: false, // Use IndexedDB for local storage.
    file: "data.json", // Persist data to a local JSON file.
    peers: [], // Gun will discover peers automatically when online.
    retry: Infinity, // Retry indefinitely when offline.
  });

  // Set up SEA for end-to-end encryption using the user's private key.
  const SEA = require("gun/sea");
  const pair = SEA.pair();
  const { epriv } = SEA.decrypt(user, pair);

  // Override Gun.js' default key pair with the user's key pair.
  // This allows for end-to-end encryption of messages.
  gun.user().auth(pair);
  gun.on("out", { epriv });

  return gun;
}
