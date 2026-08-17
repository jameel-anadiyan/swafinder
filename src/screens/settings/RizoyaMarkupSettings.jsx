import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';

export default function RizoyaMarkupSettings() {
  const { userData, dispatch, goBack } = useApp();
  const charges = userData?.charges || {};

  const [markupPct, setMarkupPct]           = useState(String(charges.markupPct ?? 0));
  const [discountLimitPct, setDiscountLimitPct] = useState(String(charges.discountLimitPct ?? 100));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_CHARGES',
      payload: {
        markupPct:        parseFloat(markupPct)        || 0,
        discountLimitPct: parseFloat(discountLimitPct) || 100,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const markupNum  = parseFloat(markupPct)        || 0;
  const limitNum   = parseFloat(discountLimitPct) || 100;

  // Preview: show what 1000 becomes after markup and max discount
  const previewBase       = 1000;
  const previewMarked     = previewBase * (1 + markupNum / 100);
  const previewMaxDisc    = previewMarked * (limitNum / 100);
  const previewFinal      = previewMarked - previewMaxDisc;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Markup & Discount Settings" onBack={goBack} />

      <div className="screen-scroll">
        <div className="screen-content">

          {/* Info banner */}
          <div style={{
            background: 'linear-gradient(135deg, #2C1F4E 0%, #1E1535 100%)',
            borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 20,
            border: '1px solid rgba(124,58,237,0.3)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(167,139,250,0.8)', marginBottom: 8 }}>
              RIZOYA Pricing Controls
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              Set a <strong style={{ color: '#A78BFA' }}>markup %</strong> to add on top of the calculated Grand Total, and a <strong style={{ color: '#A78BFA' }}>max discount %</strong> you can offer the customer from that marked-up price.
            </div>
          </div>

          {/* ── Markup % ── */}
          <div className="card card-padded" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📈</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Item Markup %</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Applied to Grand Total before showing customer</div>
              </div>
            </div>
            <div style={{ position: 'relative', marginTop: 10 }}>
              <input
                className="input-field"
                type="number" inputMode="decimal" min="0" placeholder="e.g. 20"
                value={markupPct}
                onChange={e => setMarkupPct(e.target.value)}
                style={{ fontSize: 24, fontWeight: 800, paddingRight: 50, textAlign: 'center', color: '#7C3AED' }}
              />
              <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, fontWeight: 800, color: '#7C3AED' }}>%</span>
            </div>
            {markupNum > 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
                e.g. AED 1,000 cost → AED <strong style={{ color: '#7C3AED' }}>{previewMarked.toFixed(2)}</strong> shown to customer
              </div>
            )}
          </div>

          {/* ── Discount Limit % ── */}
          <div className="card card-padded" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔻</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Max Discount Limit %</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Maximum % discount you can apply to the marked-up price</div>
              </div>
            </div>
            <div style={{ position: 'relative', marginTop: 10 }}>
              <input
                className="input-field"
                type="number" inputMode="decimal" min="0" max="100" placeholder="e.g. 15"
                value={discountLimitPct}
                onChange={e => setDiscountLimitPct(e.target.value)}
                style={{ fontSize: 24, fontWeight: 800, paddingRight: 50, textAlign: 'center', color: 'var(--error)' }}
              />
              <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, fontWeight: 800, color: 'var(--error)' }}>%</span>
            </div>

            {/* Preset buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[5, 10, 15, 20, 25].map(v => (
                <button key={v} onClick={() => setDiscountLimitPct(String(v))}
                  style={{
                    padding: '5px 14px', borderRadius: 8,
                    border: `1.5px solid ${discountLimitPct === String(v) ? 'var(--error)' : 'var(--border)'}`,
                    background: discountLimitPct === String(v) ? 'var(--error-bg)' : 'var(--surface)',
                    color: discountLimitPct === String(v) ? 'var(--error)' : 'var(--text-secondary)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>
                  {v}%
                </button>
              ))}
            </div>

            {markupNum > 0 && limitNum > 0 && limitNum < 100 && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Max discount from <strong style={{ color: '#7C3AED' }}>AED {previewMarked.toFixed(2)}</strong>
                {' '}= <strong style={{ color: 'var(--error)' }}>−AED {previewMaxDisc.toFixed(2)}</strong>
                {' '}→ min. final price: <strong>AED {previewFinal.toFixed(2)}</strong>
              </div>
            )}
          </div>

          {/* Save */}
          {saved && (
            <div style={{ background: 'var(--success-bg)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 700, color: 'var(--success)', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
              ✅ Saved! Markup: {markupNum}% · Max Discount: {limitNum}%
            </div>
          )}

          <button className="btn btn-primary btn-full" style={{ fontSize: 16 }} onClick={handleSave}>
            💾 Save Settings
          </button>

          <div className="hint-box" style={{ marginTop: 14 }}>
            These settings only affect your RIZOYA account. The markup is applied to the Grand Total in the Cost Breakup screen. The discount limit prevents offering more than your configured maximum.
          </div>
        </div>
      </div>
    </div>
  );
}
