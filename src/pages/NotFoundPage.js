import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6', // light gray background
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#0D1C44', 
        marginBottom: '16px'
      }}>
        Post Not Found
      </h1>
      <p style={{
        color: '#4B5563', // gray-600
        marginBottom: '24px'
      }}>
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" style={{
        backgroundColor: '#0D1C44',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'background-color 0.3s'
      }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#063970'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0D1C44'}
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
