import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';

export default function SwaB2bChartSettings() {
  const { userData, goBack } = useApp();
  const chart = userData?.diamondChart || [];

  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return chart.filter(r =>
      r.size.toLowerCase().includes(q) ||
      r.clarityColour.toLowerCase().includes(q) ||
      String(r.no).includes(q)
    );
  }, [chart, search]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="SWA B2B Diamond Chart" onBack={goBack} />

      {/* Info banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E4A 100%)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid rgba(184,134,11,0.2)',
      }}>
        <span style={{ fontSize: 20 }}>🔒</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F5C518', letterSpacing: 0.3 }}>SWA B2B Reference Prices</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Read-only · Used for calculation base · Carat cost per size</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="search-wrapper">
          <div className="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            className="search-bar"
            placeholder="Search size, clarity…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="screen-scroll" style={{ flex: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 360 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E4A 100%)' }}>
                <th style={{ color: 'rgba(255,255,255,0.5)', width: 36 }}>#</th>
                <th style={{ color: 'white' }}>Size</th>
                <th style={{ color: 'rgba(255,255,255,0.7)' }}>Wt (ct)</th>
                <th style={{ color: '#F5C518', background: 'rgba(184,134,11,0.15)' }}>SWA B2B Cost (AED/ct)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.no}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{row.no}</td>
                  <td style={{ fontWeight: 600, fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.size}>
                    {row.size}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {row.weightCt}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)', textAlign: 'right', paddingRight: 16 }}>
                    {row.swaCaratCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <p>No diamonds match "{search}"</p>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--surface)', lineHeight: 1.5 }}>
          {filtered.length} of {chart.length} rows shown<br />
          These are the SWA B2B wholesale reference prices used as the calculation base. Read-only.
        </div>
      </div>
    </div>
  );
}
