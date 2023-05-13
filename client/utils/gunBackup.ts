import Gun from 'gun';
import 'gun/lib/store';
import 'gun/lib/load';
import 'gun/lib/unset';
import 'gun/lib/not';
import 'gun/lib/open';
import 'gun/lib/then';
import 'gun/lib/time';
import { getUserKeyPair } from './keyManagement';
import { encryptData } from './encryption';

interface BackupData {
  key: string;
  data: any;
}

const BACKUP_PATH = 'backup';

export const backupData = async (gun: Gun) => {
  const user = gun.user();
  if (!user.is) {
    throw new Error('User is not logged in');
  }
  const keyPair = await getUserKeyPair();
  const backupNode = gun.get(BACKUP_PATH);
  const backupData: BackupData = {
    key: keyPair.publicKey,
    data: user.back(-1),
  };
  const encryptedBackupData = await encryptData(JSON.stringify(backupData), keyPair.privateKey);
  backupNode.put(encryptedBackupData);
};

export const restoreData = async (gun: Gun) => {
  const user = gun.user();
  if (!user.is) {
    throw new Error('User is not logged in');
  }
  const keyPair = await getUserKeyPair();
  const backupNode = gun.get(BACKUP_PATH);
  backupNode.open(async (backupData: any) => {
    if (backupData === undefined) {
      return;
    }
    try {
      const decryptedBackupData = JSON.parse(await gun._.SEA.decrypt(backupData, keyPair));
      if (decryptedBackupData.key !== keyPair.publicKey) {
        console.error('Invalid keypair in backup data');
        return;
      }
      user.back(decryptedBackupData.data);
    } catch (error) {
      console.error('Error restoring backup:', error);
    } finally {
      backupNode.unset();
    }
  });
};
