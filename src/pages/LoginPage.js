import React from 'react';
import { useMsal } from '@azure/msal-react';

export default function LoginPage() {
  const { instance } = useMsal();

  return (
    <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
      <h1>Login to Continue</h1>
      <p>Welcome to the Kaito IT Client Portal. Please sign in to access your dashboard.</p>
      <button onClick={() => instance.loginRedirect()}>Sign in with Microsoft</button>
      <footer style={{ marginTop: '2rem' }}>© 2025 Kaito IT</footer>
    </div>
  );
}
