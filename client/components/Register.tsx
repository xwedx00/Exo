import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { generateKeyPair, encryptPrivateKey } from '../utils/keyManagement';
import { encryptData } from '../utils/encryption';
import { getRandomString } from '../utils/randomGenerator';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [usePersonalDetails, setUsePersonalDetails] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Generate a new key pair for the user
      const { publicKey, privateKey } = await generateKeyPair();

      // Encrypt the private key with the user's password
      const encryptedPrivateKey = await encryptPrivateKey(privateKey, password);

      // Generate a random DigitalID for the user
      const digitalId = getRandomString(32);

      // Create the user object
      const user = {
        email,
        name,
        usePersonalDetails,
        publicKey: publicKey,
        encryptedPrivateKey: encryptedPrivateKey,
        digitalId,
      };

      // Encrypt user data before sending to server
      const encryptedUser = await encryptData(user, publicKey);

      // Register the user
      await registerUser(encryptedUser);

      // Redirect to login page
      history.push('/login');
    } catch (error) {
      console.error(error);
      setError('Failed to register user. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={!usePersonalDetails}
          />
        </div>
        <div>
          <label htmlFor="usePersonalDetails">
            Use Personal Details (name will be used for identification):
          </label>
          <input
            type="checkbox"
            id="usePersonalDetails"
            checked={usePersonalDetails}
            onChange={(event) => setUsePersonalDetails(event.target.checked)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Register;
