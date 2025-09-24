"use client";

import dynamic from 'next/dynamic';

// Import with better error handling and SSR support
const LandingComponent = dynamic(() => import('./LandingComponent').catch(err => {
  console.error('Error loading LandingComponent:', err);
  return { default: () => <div>Error loading page</div> };
}), {
  ssr: false, // Keep SSR disabled to prevent hydration issues
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '18px',
      color: '#666',
      backgroundColor: '#f9fff9'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #4caf50',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div>Loading Islamic Fiqh Platform...</div>
      </div>
    </div>
  )
});

export default function Landing() {
  return <LandingComponent />;
}