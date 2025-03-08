// login_page.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import backgroundImageLocal from './assets/background.png';
import logoLocal from './assets/app_icon.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');    
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    auth.signOut().then(() => {
      console.log("Signed out, showing LoginPage UI.");
    });
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please fill out both email and password!");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully:", userCredential.user);
      navigate("/statistics");
    } catch (error) {
      console.error("Error signing in:", error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: `url(${backgroundImageLocal}) no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <img
          src={logoLocal}
          alt="App Logo"
          style={{ width: '150px', marginBottom: '20px' }}
        />
        <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '24px' }}>
          Sign in for admin
        </h2>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>
        <button
          onClick={handleSignIn}
          style={{
            backgroundColor: '#00377E',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
