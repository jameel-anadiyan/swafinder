import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';

function LimitCard({ icon, title, sub, value, setValue, color, presets }) {
  return (
    <div className="card card-padded" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 10 }}>
        <input
          className="input-field"
          type="number" inputMode="decimal" min="0" max="100" placeholder="0 = no limit"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{ fontSize: 22, fontWeight: 800, paddingRight: 50, textAlign: 'center', color }}
        />
        <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, fontWeight: 800, color }}>%</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {presets.map(v => (
          <button key={v} onClick={() => setValue(String(v))}
            style={{
              padding: '5px 14px', borderRadius: 8,
              border: `1.5px solid ${value === String(v) ? color : 'var(--border)'}`,
              background: value === String(v) ? `${color}15` : 'var(--surface)',
              color: value === String(v) ? color : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
            {v === 0 ? 'No limit' : `${v}%`}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        {parseFloat(value) === 0 || value === '' ? '⚠️ No limit set — discount can go up to 100%' : `🔒 Discount capped at ${value}%`}
      </div>
    </div>
  );
}

export default function RizoyaMarkupSettings() {
  const { userData, dispatch, goBack } = useApp();
  const charges = userData?.charges || {};

  const [markupPct,              setMarkupPct]              = useState(String(charges.markupPct ?? 0));
  const [discountLimitPct,       setDiscountLimitPct]       = useState(String(charges.discountLimitPct ?? 0));
  const [diamondDiscountLimitPct, setDiamondDiscountLimitPct] = useState(String(charges.diamondDiscountLimitPct ?? 0));
  const [makingDiscountLimitPct,  setMakingDiscountLimitPct]  = useState(String(charges.makingDiscountLimitPct ?? 0));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_CHARGES',
      payload: {
        markupPct:               parseFloat(markupPct)               || 0,
        discountLimitPct:        parseFloat(discountLimitPct)        || 0,
        diamondDiscountLimitPct: parseFloat(diamondDiscountLimitPct) || 0,
        makingDiscountLimitPct:  parseFloat(makingDiscountLimitPct)  || 0,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const markupNum = parseFloat(markupPct) || 0;
  const limitNum  = parseFloat(discountLimitPct) || 0;

  const previewBase    = 1000;
  const previewMarked  = previewBase * (1 + markupNum / 100);
  const previewMaxDisc = previewMarked * (limitNum / 100);
  const previewFinal   = previewMarked - previewMaxDisc;

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
              Set a <strong style={{ color: '#A78BFA' }}>markup %</strong> on Grand Total and individual <strong style={{ color: '#A78BFA' }}>discount limits</strong> for customer price, diamond, and making charge.
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

          {/* ── Section header: Discount Limits ── */}
          <div style={{ padding: '4px 2px 8px', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            🔒 Discount Limits (0 = no limit)
          </div>

          {/* ── Customer Discount Limit ── */}
          <LimitCard
            icon="🔻" title="Customer Price Discount Limit"
            sub="Max % discount on marked-up customer price"
            value={discountLimitPct} setValue={setDiscountLimitPct}
            color="var(--error)" presets={[0, 5, 10, 15, 20, 25]}
          />

          {/* ── Diamond Discount Limit ── */}
          <LimitCard
            icon="💎" title="Diamond Amount Discount Limit"
            sub="Max % discount allowed on diamond amount"
            value={diamondDiscountLimitPct} setValue={setDiamondDiscountLimitPct}
            color="#1A5CBA" presets={[0, 5, 10, 15, 20, 25]}
          />

          {/* ── Making Charge Discount Limit ── */}
          <LimitCard
            icon="🔧" title="Making Charge Discount Limit"
            sub="Max % discount allowed on making charge"
            value={makingDiscountLimitPct} setValue={setMakingDiscountLimitPct}
            color="#047857" presets={[0, 5, 10, 15, 20, 25]}
          />

          {/* Preview */}
          {markupNum > 0 && limitNum > 0 && (
            <div style={{ marginBottom: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              Max discount from <strong style={{ color: '#7C3AED' }}>AED {previewMarked.toFixed(2)}</strong>
              {' '}= <strong style={{ color: 'var(--error)' }}>−AED {previewMaxDisc.toFixed(2)}</strong>
              {' '}→ min. final: <strong>AED {previewFinal.toFixed(2)}</strong>
            </div>
          )}

          {/* Save */}
          {saved && (
            <div style={{ background: 'var(--success-bg)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 700, color: 'var(--success)', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
              ✅ Saved! Markup: {markupNum}% · Customer Limit: {parseFloat(discountLimitPct)||0}% · Diamond Limit: {parseFloat(diamondDiscountLimitPct)||0}% · Making Limit: {parseFloat(makingDiscountLimitPct)||0}%
            </div>
          )}

          <button className="btn btn-primary btn-full" style={{ fontSize: 16 }} onClick={handleSave}>
            💾 Save Settings
          </button>

          <div className="hint-box" style={{ marginTop: 14 }}>
            These settings only affect your RIZOYA account. Set any limit to 0 to allow unlimited discount on that field. When a limit is hit, a warning popup will appear in the Cost Breakup screen.
          </div>
        </div>
      </div>
    </div>
  );
}
