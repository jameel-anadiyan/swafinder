import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';

export default function DiamondChartSettings() {
  const { userData, dispatch, goBack } = useApp();
  const chart = userData?.diamondChart || [];
  const pm = userData?.pricingMethod || { mode: 'manual', percent: 0 };

  const [search, setSearch] = useState('');
  const [pctInput, setPctInput] = useState(String(pm.percent || ''));
  const [activeTab, setActiveTab] = useState(pm.mode === 'swaPlusPercent' ? 1 : 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return chart.filter(r =>
      r.size.toLowerCase().includes(q) ||
      r.clarityColour.toLowerCase().includes(q) ||
      String(r.no).includes(q)
    );
  }, [chart, search]);

  const handleRowEdit = (no, val) => {
    const num = parseFloat(val);
    dispatch({ type: 'UPDATE_DIAMOND_ROW', no, myPrice: isNaN(num) ? null : num });
  };

  const handleApplyPct = () => {
    const pct = parseFloat(pctInput);
    if (isNaN(pct)) return;
    dispatch({ type: 'APPLY_SWA_PERCENT', percent: pct });
    dispatch({ type: 'SET_PRICING_METHOD', payload: { mode: 'swaPlusPercent', percent: pct } });
  };

  const switchTab = (idx) => {
    setActiveTab(idx);
    dispatch({ type: 'SET_PRICING_METHOD', payload: { mode: idx === 0 ? 'manual' : 'swaPlusPercent' } });
  };

  // % difference: ((myPrice - swaCaratCost) / swaCaratCost) * 100
  const pctDiff = (row) => {
    if (row.myPrice == null || row.myPrice === 0 || row.swaCaratCost === 0) return null;
    return ((row.myPrice - row.swaCaratCost) / row.swaCaratCost) * 100;
  };

  const fmtPct = (v) => {
    if (v === null) return <span style={{ color: 'var(--text-muted)' }}>—</span>;
    const color = v > 0 ? '#16A34A' : v < 0 ? '#DC2626' : 'var(--text-muted)';
    return <span style={{ color, fontWeight: 700, fontSize: 11 }}>{v > 0 ? '+' : ''}{v.toFixed(1)}%</span>;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Diamond Chart & Pricing" onBack={goBack} />

      {/* Mode Tabs */}
      <div style={{ padding: '12px 16px 8px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="chip-tabs">
          <button className={`chip-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => switchTab(0)}>
            Edit Individually
          </button>
          <button className={`chip-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => switchTab(1)}>
            SWA + % for All
          </button>
        </div>

        {activeTab === 1 && (
          <div style={{ marginTop: 12, animation: 'fadeIn 0.2s ease forwards' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label className="input-label">Markup % over SWA Carat Cost</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field"
                    style={{ paddingRight: 30, height: 42 }}
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g. 12"
                    value={pctInput}
                    onChange={e => setPctInput(e.target.value)}
                  />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>%</span>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ height: 42, borderRadius: 'var(--radius-sm)', fontSize: 13, paddingTop: 0, paddingBottom: 0 }}
                onClick={handleApplyPct}
              >
                Apply to All
              </button>
            </div>
            {pctInput && !isNaN(parseFloat(pctInput)) && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Example: SWA 51,000 + {pctInput}% = <strong style={{ color: 'var(--gold-dark)' }}>{Math.round(51000 * (1 + parseFloat(pctInput) / 100)).toLocaleString()}</strong>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div style={{ marginTop: 10 }}>
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
      </div>

      {/* Table */}
      <div className="screen-scroll" style={{ flex: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 480 }}>
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th>Size</th>
                <th>Wt (ct)</th>
                <th>SWA Cost</th>
                <th style={{ background: '#1A3A6A', color: 'var(--gold-light)' }}>My Price</th>
                <th style={{ background: '#0F2D1F', color: '#4ADE80', textAlign: 'center' }}>% vs SWA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const diff = pctDiff(row);
                return (
                  <tr key={row.no}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{row.no}</td>
                    <td style={{ fontWeight: 600, fontSize: 12, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.size}>{row.size}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{row.weightCt}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {row.swaCaratCost.toLocaleString()}
                    </td>
                    <td>
                      <input
                        className="td-input"
                        type="number"
                        inputMode="decimal"
                        placeholder="—"
                        value={row.myPrice ?? ''}
                        onChange={e => handleRowEdit(row.no, e.target.value)}
                        style={{ width: 90 }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', background: diff !== null ? (diff > 0 ? 'rgba(22,163,74,0.06)' : diff < 0 ? 'rgba(220,38,38,0.06)' : 'transparent') : 'transparent' }}>
                      {fmtPct(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <p>No diamonds match "{search}"</p>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          {filtered.length} of {chart.length} rows shown · My Price feeds CT Price in Cost Breakup · % vs SWA shows your markup over SWA cost
        </div>
      </div>
    </div>
  );
}
