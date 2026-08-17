import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SplashScreen() {
  const { state, navigate } = useApp();
  const user = state.currentUser;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(tick);
        setTimeout(() => navigate('goldgate'), 200);
      }
    }, 30);
    return () => clearInterval(tick);
  }, [navigate]);

  if (!user) return null;

  const pct = Math.round(progress * 100);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(160deg, ${user.accentColor}22 0%, #FFFFFF 60%)`,
      padding: 32,
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeIn 0.5s ease forwards',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 300, height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${user.accentColor}20 0%, transparent 70%)`,
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80, width: 250, height: 250,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${user.accentColor}15 0%, transparent 70%)`,
      }} />

      {/* Brand logo */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 100, height: 100,
          background: `linear-gradient(135deg, ${user.accentColor} 0%, ${user.accentColor}CC 100%)`,
          borderRadius: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: `0 12px 40px ${user.accentColor}40`,
          animation: 'scaleIn 0.5s cubic-bezier(.34,1.56,.64,1) forwards',
        }}>
          <span style={{ fontSize: 42, fontWeight: 800, color: 'white', fontFamily: 'var(--font-serif)', letterSpacing: -2 }}>
            {user.logoInitials}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          fontWeight: 700,
          color: user.accentColor,
          marginBottom: 4,
          animation: 'fadeUp 0.5s 0.2s ease both',
        }}>
          {user.brandName}
        </h1>
        <p style={{
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 48,
          animation: 'fadeUp 0.5s 0.3s ease both',
        }}>
          Premium Diamond Jewellery
        </p>

        {/* Progress */}
        <div style={{
          width: 220,
          animation: 'fadeUp 0.5s 0.4s ease both',
        }}>
          <div style={{
            height: 4,
            background: 'var(--neutral-200)',
            borderRadius: 2,
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${user.accentColor}, ${user.accentColor}99)`,
              borderRadius: 2,
              transition: 'width 0.03s linear',
            }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Loading {user.brandName}… {pct}%
          </p>
        </div>
      </div>

      {/* Powered by */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        <span>💎</span>
        <span>Powered by <strong style={{ color: 'var(--gold-dark)' }}>SWA Finder</strong></span>
      </div>
    </div>
  );
}
