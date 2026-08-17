import React from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';
import { BREAKUP_FIELDS } from '../../data/seedData';

function groupFields(fields) {
  const groups = {};
  fields.forEach(f => {
    if (!groups[f.group]) groups[f.group] = [];
    groups[f.group].push(f);
  });
  return Object.entries(groups);
}

export default function BreakupVisibilitySettings() {
  const { userData, dispatch, goBack } = useApp();
  const vis = userData?.fieldVisibility?.breakup || {};

  const handleToggle = (key, val) => {
    dispatch({ type: 'SET_FIELD_VISIBILITY', visType: 'breakup', key, value: val });
  };

  const handleToggleAll = (keys, val) => {
    keys.forEach(key => dispatch({ type: 'SET_FIELD_VISIBILITY', visType: 'breakup', key, value: val }));
  };

  const groups = groupFields(BREAKUP_FIELDS);
  const totalOn = Object.values(vis).filter(Boolean).length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Break-Up Settings" onBack={goBack} />

      <div style={{ padding: '10px 16px 6px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {totalOn} of {BREAKUP_FIELDS.length} fields shown in Cost Breakup
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-xs" onClick={() => handleToggleAll(BREAKUP_FIELDS.map(f => f.key), true)}>All On</button>
            <button className="btn btn-ghost btn-xs" onClick={() => handleToggleAll(BREAKUP_FIELDS.map(f => f.key), false)}>All Off</button>
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        {groups.map(([group, fields]) => (
          <div key={group} style={{ marginBottom: 0 }}>
            <div style={{ padding: '10px 16px 4px', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)', background: 'var(--surface-2)' }}>
              {group}
            </div>
            <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              {fields.map(f => (
                <div key={f.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 16px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: vis[f.key] ? 'var(--success)' : 'var(--neutral-300)',
                      transition: 'background 0.2s',
                    }} />
                    <span style={{ fontSize: 14, color: vis[f.key] ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
                      {f.label}
                    </span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={!!vis[f.key]}
                      onChange={e => handleToggle(f.key, e.target.checked)}
                    />
                    <div className="toggle-track">
                      <div className="toggle-thumb" />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ padding: 16, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'center' }}>
          Toggling fields OFF hides them immediately in the on-screen Cost Breakup. This does not affect the Print slip — use Print Settings for that.
        </div>
      </div>
    </div>
  );
}
