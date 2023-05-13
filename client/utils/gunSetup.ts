import Gun from 'gun';
import SEA from 'gun/sea';
import { GunOptions } from 'gun/types/options';
import { getPrivateKey, setPrivateKey } from './keyManagement';
import { backupData, restoreData } from './gunBackup';
import { initGunOffline } from './gunOffline';

export const setupGun = async (options?: GunOptions): Promise<Gun> => {
  // Get or generate a private key
  const privateKey = await getPrivateKey();
  if (!privateKey) {
    const keyPair = await SEA.pair();
    await setPrivateKey(keyPair);
  }

  // Initialize Gun
  const gun = Gun(options);

  // Set the user's key pair for encryption
  gun.user().auth(privateKey);

  // Handle gun backups and restores
  gun.on('out', backupData);
  await restoreData(gun);

  // Initialize Gun Offline
  initGunOffline(gun);

  return gun;
};
