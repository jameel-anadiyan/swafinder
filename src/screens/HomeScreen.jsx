import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBar } from '../components/NavBar';
import { fmtDatetime } from '../utils/calculations';

export default function HomeScreen() {
  const { state, userData, navigate, dispatch } = useApp();
  const user = state.currentUser;
  const gold = userData?.goldPrice;
  const [showStaleAlert, setShowStaleAlert] = useState(false);

  // ── Gold rate stale check ──────────────────────────────────────────────────
  useEffect(() => {
    const intervalH = gold?.updateIntervalHours ?? 0;
    const lastUpdated = gold?.lastUpdated;
    if (intervalH > 0 && lastUpdated) {
      const elapsedMs = Date.now() - new Date(lastUpdated).getTime();
      const intervalMs = intervalH * 60 * 60 * 1000;
      if (elapsedMs >= intervalMs) setShowStaleAlert(true);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Sign out?')) dispatch({ type: 'LOGOUT' });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)', animation: 'fadeIn 0.3s ease forwards' }}>
      <StatusBar />

      {/* ── Gold rate stale reminder ── */}
      {showStaleAlert && (
        <div style={{
          background: 'linear-gradient(135deg, #7A4E0A 0%, #5C3A06 100%)',
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'fadeIn 0.3s ease',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⏰</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F5C518' }}>Gold rate update due</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
              Last updated {gold?.updateIntervalHours}h+ ago — please refresh the rate
            </div>
          </div>
          <button onClick={() => { setShowStaleAlert(false); navigate('settings-gold'); }}
            style={{ background: '#F5C518', color: '#1C1914', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}>
            Update
          </button>
          <button onClick={() => setShowStaleAlert(false)}
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 8, width: 28, height: 28, fontSize: 16, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #1C1914 0%, #2A2318 100%)',
        padding: '12px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${user?.accentColor}30 0%, transparent 70%)`,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44,
              background: `linear-gradient(135deg, ${user?.accentColor} 0%, ${user?.accentColor}CC 100%)`,
              borderRadius: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800, color: 'white',
              letterSpacing: -0.5,
              boxShadow: `0 4px 16px ${user?.accentColor}40`,
            }}>
              {user?.logoInitials}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white', fontFamily: 'var(--font-serif)' }}>
                {user?.brandName}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>
                Pricing Dashboard
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Gold price chip */}
        {gold && (
          <div className="gold-chip" style={{ position: 'relative' }}>
            <div className="gold-chip-dot" />
            <span>18K Gold: <strong>AED {gold.ratePerGram}/g</strong></span>
            {gold.lastUpdated && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                · {fmtDatetime(gold.lastUpdated)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main actions */}
      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
          Quick Actions
        </div>

        {/* Scan Card */}
        <button
          onClick={() => navigate('scan')}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #1C1914 0%, #2D2920 100%)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px',
            cursor: 'pointer',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'; }}
        >
          {/* Decorative */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 160, height: 160,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,75,0.2) 0%, transparent 70%)',
          }} />

          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            marginBottom: 16,
            boxShadow: 'var(--shadow-gold)',
          }}>
            📷
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 6, fontFamily: 'var(--font-serif)' }}>
              Scan & Price
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
              Scan jewellery barcode or enter SKU to get live cost breakup
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>
            Open Scanner
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </button>

        {/* Settings Card */}
        <button
          onClick={() => navigate('settings')}
          style={{
            flex: 1,
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px',
            cursor: 'pointer',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; }}
        >
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 120, height: 120,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,75,0.08) 0%, transparent 70%)',
          }} />

          <div style={{
            width: 56, height: 56,
            background: 'var(--gold-bg)',
            border: '1.5px solid var(--gold-border)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            marginBottom: 16,
          }}>
            ⚙️
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, fontFamily: 'var(--font-serif)' }}>
              Settings
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Configure gold price, diamond chart, making charges & more
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-dark)', fontSize: 13, fontWeight: 600 }}>
            Open Settings
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
