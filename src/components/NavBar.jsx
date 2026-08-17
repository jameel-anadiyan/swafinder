import React from 'react';

export default function NavBar({ title, onBack, rightAction }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="nav-bar" style={{ paddingTop: '0' }}>
      {onBack ? (
        <button className="nav-back-btn" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      <div className="nav-title">{title}</div>
      {rightAction ? (
        <button className="nav-action" onClick={rightAction.onClick}>{rightAction.label}</button>
      ) : (
        <div style={{ width: 36 }} />
      )}
    </div>
  );
}

export function StatusBar({ dark }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const color = dark ? 'rgba(255,255,255,0.9)' : 'var(--text-primary)';

  return (
    <div className="status-bar" style={{ color }}>
      <span className="status-time">{timeStr}</span>
      <div className="status-icons">
        {/* Signal */}
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="1" y="14" width="3" height="7" rx="1"/>
          <rect x="6" y="10" width="3" height="11" rx="1"/>
          <rect x="11" y="6" width="3" height="15" rx="1"/>
          <rect x="16" y="2" width="3" height="19" rx="1" opacity="0.4"/>
        </svg>
        {/* WiFi */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
          <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
          <circle cx="12" cy="20" r="1" fill="currentColor"/>
        </svg>
        {/* Battery */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="7" width="18" height="10" rx="2"/>
          <path d="M23 11v2" strokeLinecap="round"/>
          <rect x="3" y="9" width="12" height="6" rx="1" fill="currentColor" stroke="none"/>
        </svg>
      </div>
    </div>
  );
}
