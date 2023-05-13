import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import { encryptData } from '../utils/encryption';
import { generateDigitalId } from '../utils/digitalId';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const digitalId = generateDigitalId();
      const encryptedEmail = encryptData(email, digitalId.privateKey);
      const encryptedPassword = encryptData(password, digitalId.privateKey);

      const token = await loginUser({
        email: encryptedEmail,
        password: encryptedPassword,
        rememberMe,
      });

      localStorage.setItem('token', token);

      history.push('/chat');
    } catch (error) {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div>
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={handleRememberMeChange} />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default Login;
