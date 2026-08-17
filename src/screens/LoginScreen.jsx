import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBar } from '../components/NavBar';

export default function LoginScreen() {
  const { login, navigate } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    // slight delay for feel
    await new Promise(r => setTimeout(r, 400));
    const ok = login(username.trim(), password.trim());
    if (ok) {
      navigate('splash');
    } else {
      setError('Invalid credentials. Try bluestone / 1234');
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)', animation: 'fadeIn 0.4s ease forwards' }}>
      <StatusBar />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(160deg, #1C1914 0%, #2A2318 50%, #1C1914 100%)',
        padding: '32px 28px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,75,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,75,0.1) 0%, transparent 70%)',
        }} />

        {/* Logo */}
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}>
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(201,162,75,0.4)',
              fontSize: 22,
            }}>
              💎
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.5px', fontFamily: 'var(--font-serif)' }}>
                SWA Finder
              </div>
              <div style={{ fontSize: 11, color: 'rgba(201,162,75,0.8)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Diamond Jewellery Pricing
              </div>
            </div>
          </div>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.5 }}>
          Sign in to access your<br />
          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>retailer pricing dashboard</span>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                className="input-field"
                style={{ paddingLeft: 40 }}
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                className="input-field"
                style={{ paddingLeft: 40, paddingRight: 44 }}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPass ? (
                    <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  ) : (
                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--error-bg)',
              border: '1px solid rgba(192,57,43,0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: 13,
              color: 'var(--error)',
              marginBottom: 14,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              animation: 'fadeIn 0.2s ease forwards',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? (
              <><div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> Signing in…</>
            ) : (
              <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div className="hint-box" style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, color: 'var(--gold-dark)', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Demo Credentials (password: 1234)</div>
          {[
            { u: 'swaburjman', b: 'SWA Burjman ⭐ Special', color: '#B8860B' },
            { u: 'rizoya',     b: 'RIZOYA Jewellery',       color: '#7C3AED' },
            { u: 'bluestone',  b: 'Bluestone Jewels',       color: '#1A5CBA' },
            { u: 'malabar',    b: 'Malabar Diamonds',       color: '#8B1A1A' },
            { u: 'joyalukkas', b: 'Joyalukkas Fine',        color: '#1A7A4A' },
          ].map(d => (
            <div
              key={d.u}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, cursor: 'pointer', padding: '3px 6px', borderRadius: 4, transition: 'background 0.15s' }}
              onClick={() => { setUsername(d.u); setPassword('1234'); setError(''); }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,162,75,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{d.u}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.b}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>👆 Tap any row to autofill</div>
        </div>
      </div>
    </div>
  );
}
