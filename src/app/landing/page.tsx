"use client";

import dynamic from 'next/dynamic';

// Disable SSR for the entire landing page to fix hydration issues
const LandingComponent = dynamic(() => import('./LandingComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Loading...
    </div>
  )
});

export default function Landing() {
  return <LandingComponent />;
}