import { PrivateKey } from "encryption";
import { DigitalId } from "digitalId";
import { PlanetScaleDB } from "planetScaleDB";

const BACKUP_FILE_NAME = "backup.json";

export async function backupToCloud(privateKey: PrivateKey, digitalId: DigitalId, planetScaleDB: PlanetScaleDB): Promise<boolean> {
  const backupData = await planetScaleDB.getAllUserData(digitalId);

  const encryptedBackupData = privateKey.encrypt(JSON.stringify(backupData));

  const success = await planetScaleDB.uploadBackupFile(BACKUP_FILE_NAME, encryptedBackupData);

  return success;
}

export async function restoreFromCloud(privateKey: PrivateKey, planetScaleDB: PlanetScaleDB, digitalId: DigitalId): Promise<boolean> {
  const encryptedBackupData = await planetScaleDB.downloadBackupFile(BACKUP_FILE_NAME);

  if (!encryptedBackupData) {
    return false;
  }

  const decryptedBackupData = privateKey.decrypt(encryptedBackupData);

  if (!decryptedBackupData) {
    return false;
  }

  const backupData = JSON.parse(decryptedBackupData);

  await planetScaleDB.restoreAllUserData(backupData, digitalId);

  return true;
}
