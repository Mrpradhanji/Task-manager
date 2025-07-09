import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      // Optionally redirect or update UI
    } else {
      alert(data.message || 'Google login failed');
    }
  };

  return (
    <div>
      {/* ...your login form... */}
      {/* Google Login removed */}
    </div>
  );
}

export default Login; 