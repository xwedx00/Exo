import { Document, Schema, model } from 'mongoose';
import { generateKeyPair } from '../utils/keyManagement';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  digitalId: string;
  publicKey: string;
  privateKey: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  digitalId: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true }
});

// Generate keypair for new user
UserSchema.pre<IUser>('save', function (next) {
  if (!this.isNew) {
    return next();
  }
  generateKeyPair()
    .then(({ publicKey, privateKey }) => {
      this.publicKey = publicKey;
      this.privateKey = privateKey;
      next();
    })
    .catch((err) => {
      next(err);
    });
});

export default model<IUser>('User', UserSchema);
