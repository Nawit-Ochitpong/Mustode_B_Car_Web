// login_page.js
import React from 'react';

const LoginPage = () => {
  return (
    <div style={{ width: 1728, height: 1117, position: 'relative', background: 'white' }}>
      <img
        style={{ width: 1933, height: 1201, left: -186, top: -25, position: 'absolute' }}
        src="https://placehold.co/1933x1201"
        alt="background"
      />
      <div
        style={{
          width: 1742,
          height: 1117,
          left: -7,
          top: 0,
          position: 'absolute',
          background: 'rgba(0, 0, 0, 0.50)',
        }}
      />
      <div
        style={{
          width: 659,
          height: 729,
          left: 535,
          top: 152,
          position: 'absolute',
          background: 'rgba(255, 255, 255, 0.90)',
          borderRadius: 40,
        }}
      />
      <div style={{ width: 389, height: 389, left: 80, top: 322, position: 'absolute' }} />
      <img
        style={{ width: 291, height: 234, left: 719, top: 174, position: 'absolute' }}
        src="https://placehold.co/291x234"
        alt="logo"
      />
      <div
        style={{
          width: 427,
          height: 31,
          left: 651,
          top: 701,
          position: 'absolute',
          background: '#00377E',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.40)',
          borderRadius: 19,
          border: '1px black solid',
        }}
      />
      <div
        style={{
          width: 60,
          height: 26,
          left: 834,
          top: 704,
          position: 'absolute',
          color: 'white',
          fontSize: 15,
          fontFamily: 'IBM Plex Sans Thai Looped',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        Sign in
      </div>
      <div
        style={{
          width: 427,
          height: 34,
          left: 651,
          top: 574,
          position: 'absolute',
          background: 'white',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.40)',
          borderRadius: 7,
          border: '1px rgba(0, 0, 0, 0.20) solid',
        }}
      />
      <div
        style={{
          width: 427,
          height: 34,
          left: 651,
          top: 630,
          position: 'absolute',
          background: 'white',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.40)',
          borderRadius: 7,
          border: '1px rgba(0, 0, 0, 0.20) solid',
        }}
      />
      <div
        style={{
          width: 252,
          height: 53,
          left: 739,
          top: 464,
          position: 'absolute',
          textAlign: 'center',
          color: 'black',
          fontSize: 32,
          fontFamily: 'IBM Plex Sans Thai Looped',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        Sign in for admin
      </div>
      <div
        style={{
          left: 659,
          top: 578,
          position: 'absolute',
          color: '#8F8F8F',
          fontSize: 15,
          fontFamily: 'IBM Plex Sans Thai Looped',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        Username
      </div>
      <div
        style={{
          left: 659,
          top: 634,
          position: 'absolute',
          color: '#8F8F8F',
          fontSize: 15,
          fontFamily: 'IBM Plex Sans Thai Looped',
          fontWeight: '400',
          wordWrap: 'break-word',
        }}
      >
        Password
      </div>
    </div>
  );
};

export default LoginPage;
