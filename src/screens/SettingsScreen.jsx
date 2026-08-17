import React from 'react';
import { useApp } from '../context/AppContext';
import NavBar, { StatusBar } from '../components/NavBar';

const SETTINGS_ITEMS = [
  { key: 'gold',     icon: '🪙', label: 'Gold Price',           sub: 'Update 18K rate & timestamp',      color: '#FDF3DC', screen: 'settings-gold'    },
  { key: 'diamond',  icon: '💎', label: 'Diamond Chart',        sub: 'View & set My Price for 117 rows', color: '#EEF3FF', screen: 'settings-diamond' },
  { key: 'cert',     icon: '📋', label: 'Certification Charge', sub: 'Flat charge & include toggle',     color: '#F0FFF4', screen: 'settings-cert'    },
  { key: 'making',   icon: '🔧', label: 'Making Charge',        sub: 'MC%, net-weight band & fixed min', color: '#FFF0F0', screen: 'settings-making'  },
  { key: 'stone',    icon: '💠', label: 'Other Stone Charge',   sub: 'Rate per carat (AED)',             color: '#F0F8FF', screen: 'settings-stone'   },
  { key: 'breakup',  icon: '📊', label: 'Break-Up Settings',   sub: 'Show / hide fields in cost view',  color: '#FDF8EF', screen: 'settings-breakup' },
  { key: 'print',    icon: '🖨️', label: 'Print Settings',       sub: 'Show / hide fields on print slip', color: '#F5F0FF', screen: 'settings-print'   },
];

function SettingsRow({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="list-row"
      style={{ width: '100%', background: 'var(--surface)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
    >
      <div className="list-row-icon" style={{ background: item.color }}>
        <span style={{ fontSize: 18 }}>{item.icon}</span>
      </div>
      <div className="list-row-content">
        <div className="list-row-title">{item.label}</div>
        <div className="list-row-sub">{item.sub}</div>
      </div>
      {item.locked ? (
        <div style={{ fontSize: 16, color: 'var(--text-muted)', marginLeft: 4 }}>🔒</div>
      ) : (
        <div className="list-row-chevron">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default function SettingsScreen() {
  const { navigate, goBack, dispatch, state, userData } = useApp();
  const user = state.currentUser;
  const isSpecial = user?.isSpecial;
  const isRizoya  = user?.id === 'rizoya';

  const handleReset = () => {
    if (window.confirm('Reset all demo data for this user to defaults?')) {
      dispatch({ type: 'RESET_USER_DATA' });
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Settings" onBack={goBack} />

      <div className="screen-scroll">
        {/* ── SWA Burjman Special Settings (only for special users) ── */}
        {isSpecial && (
          <>
            <div style={{ padding: '8px 16px 4px' }}>
              <div className="section-header" style={{ color: '#B8860B' }}>⭐ Special Pricing</div>
            </div>
            <div style={{
              margin: '0 16px 16px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(184,134,11,0.15)',
              border: '1.5px solid rgba(184,134,11,0.3)',
            }}>
              <button
                onClick={() => navigate('settings-special')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '14px 16px',
                  background: 'linear-gradient(135deg, #1C1914 0%, #2A2318 100%)',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, #B8860B, #8B6914)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  boxShadow: '0 3px 12px rgba(184,134,11,0.35)',
                }}>
                  🔒
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Special Price Setting</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    50% admin-locked markup · View only
                  </div>
                </div>
                <div style={{
                  background: 'rgba(184,134,11,0.2)',
                  borderRadius: 8, padding: '4px 10px',
                  fontSize: 13, fontWeight: 800, color: '#F5C518',
                }}>50%</div>
              </button>
            </div>
          </>
        )}

        {/* ── RIZOYA Pricing Settings ── */}
        {isRizoya && (
          <>
            <div style={{ padding: '8px 16px 4px' }}>
              <div className="section-header" style={{ color: '#7C3AED' }}>💜 RIZOYA Pricing</div>
            </div>
            <div style={{
              margin: '0 16px 16px',
              borderRadius: 'var(--radius-md)', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(124,58,237,0.15)',
              border: '1.5px solid rgba(124,58,237,0.3)',
            }}>
              <button
                onClick={() => navigate('settings-rizoya-markup')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 16px', background: 'linear-gradient(135deg, #1E1535 0%, #2C1F4E 100%)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📈</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Markup & Discount Settings</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    Item markup % · max discount limit %
                  </div>
                </div>
                <div style={{ background: 'rgba(124,58,237,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 800, color: '#A78BFA' }}>
                  {userData?.charges?.markupPct ?? 0}%
                </div>
              </button>
            </div>
          </>
        )}

        {/* ── Standard Settings ── */}
        <div style={{ padding: '0 16px 4px' }}>
          <div className="section-header">Pricing Configuration</div>
        </div>
        <div style={{ margin: '0 16px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {SETTINGS_ITEMS.map(item => (
            <SettingsRow key={item.key} item={item} onClick={() => navigate(item.screen)} />
          ))}
        </div>

        {/* ── Danger Zone ── */}
        <div style={{ padding: '24px 16px 8px' }}>
          <div className="section-header">Danger Zone</div>
        </div>
        <div style={{ margin: '0 16px 40px' }}>
          <button
            onClick={handleReset}
            className="btn btn-danger btn-full"
            style={{ borderRadius: 'var(--radius-md)', height: 48, fontSize: 14 }}
          >
            🔄 Reset Demo Data
          </button>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
            Resets all pricing settings, diamond chart & gold price to defaults.
          </div>
        </div>
      </div>
    </div>
  );
}
