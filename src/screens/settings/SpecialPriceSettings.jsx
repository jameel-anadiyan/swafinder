import React from 'react';
import NavBar, { StatusBar } from '../../components/NavBar';
import { useApp } from '../../context/AppContext';

export default function SpecialPriceSettings() {
  const { goBack, state } = useApp();
  const user = state.currentUser;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Special Price Setting" onBack={goBack} />

      <div className="screen-scroll">
        <div className="screen-content">
          {/* Admin-locked badge */}
          <div style={{
            background: 'linear-gradient(135deg, #1C1914 0%, #2A2318 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 160, height: 160,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,134,11,0.25) 0%, transparent 70%)',
            }} />

            {/* Lock icon */}
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, marginBottom: 16,
              boxShadow: '0 4px 20px rgba(184,134,11,0.35)',
            }}>
              🔒
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(184,134,11,0.7)', marginBottom: 6 }}>
              Admin-Locked Setting
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#F5C518', marginBottom: 6 }}>
              50%
              <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>markup</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Applied automatically to Grand Total for all SWA Burjman pricing
            </div>
          </div>

          {/* Info card */}
          <div className="card card-padded" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 12 }}>
              How it works
            </div>
            {[
              { icon: '📊', label: 'Normal Price', desc: 'Full cost breakup calculated as usual (gold + diamonds + making + VAT)' },
              { icon: '✕ 1.5', label: 'SWA Markup Applied', desc: 'Grand Total is multiplied by 1.5 (50% markup) to get the SWA Special Price' },
              { icon: '%', label: 'Customer Discount', desc: 'You can offer up to 10% discount on the SWA Special Price for this customer' },
              { icon: '💰', label: 'Final Price', desc: 'SWA Special Price minus the applied customer discount' },
            ].map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                paddingBottom: 12, marginBottom: 12,
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'var(--gold-bg)', border: '1px solid var(--gold-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: 'var(--gold-dark)',
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Lock notice */}
          <div style={{
            background: 'var(--error-bg)',
            border: '1px solid rgba(192,57,43,0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16 }}>🔒</span>
            <div style={{ fontSize: 12, color: 'var(--error)', lineHeight: 1.5 }}>
              <strong>Admin-Controlled:</strong> The 50% markup rate is set by SWA management and cannot be changed from this device. Contact your SWA administrator to adjust the markup rate.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
