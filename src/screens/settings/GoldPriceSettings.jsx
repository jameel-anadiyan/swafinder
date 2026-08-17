import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';

function fmtDate(iso) {
  if (!iso) return 'Not set';
  return new Date(iso).toLocaleString('en-AE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export default function GoldPriceSettings() {
  const { userData, dispatch, goBack } = useApp();
  const gp = userData?.goldPrice;

  // ── Rate confirmation state ────────────────────────────────────────────────
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [saved, setSaved] = useState(false);
  const [touched2, setTouched2] = useState(false);

  // ── Interval state ─────────────────────────────────────────────────────────
  const [intervalHours, setIntervalHours] = useState(
    String(gp?.updateIntervalHours ?? 0)
  );
  const [intervalSaved, setIntervalSaved] = useState(false);

  const r1 = parseFloat(rate1);
  const r2 = parseFloat(rate2);
  const rate1Valid = !isNaN(r1) && r1 > 0;
  const rate2Valid = !isNaN(r2) && r2 > 0;
  const match    = rate1Valid && rate2Valid && r1 === r2;
  const mismatch = touched2 && rate2.length > 0 && rate1Valid && rate2Valid && r1 !== r2;
  const canSave  = match;

  const handleSave = () => {
    if (!canSave) return;
    dispatch({ type: 'SET_GOLD_PRICE', rate: r1 });
    setSaved(true);
    setRate1(''); setRate2(''); setTouched2(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveInterval = () => {
    const h = parseFloat(intervalHours) || 0;
    dispatch({ type: 'SET_GOLD_INTERVAL', hours: h });
    setIntervalSaved(true);
    setTimeout(() => setIntervalSaved(false), 2000);
  };

  const currentInterval = gp?.updateIntervalHours ?? 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Gold Price" onBack={goBack} />

      <div className="screen-scroll">
        <div className="screen-content">

          {/* ── Current rate card ── */}
          <div style={{
            background: 'linear-gradient(135deg, #1C1914 0%, #2A2318 100%)',
            borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: 20,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,75,0.2) 0%, transparent 70%)' }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(201,162,75,0.7)', marginBottom: 8 }}>Current Gold Rate</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#F5C518', marginBottom: 4 }}>
              AED {gp?.ratePerGram ?? '—'}
              <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>/gram</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Last updated: {fmtDate(gp?.lastUpdated)}</div>
            {currentInterval > 0 && (
              <div style={{ fontSize: 11, color: 'rgba(245,197,24,0.6)', marginTop: 4 }}>
                ⏰ Remind every {currentInterval}h
              </div>
            )}
          </div>

          {/* ── Save success ── */}
          {saved && (
            <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(26,122,74,0.25)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.3s ease' }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>Gold rate updated!</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AED {r1}/gram saved</div>
              </div>
            </div>
          )}

          {/* ── Rate update form ── */}
          <div className="card card-padded" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 14 }}>Update Gold Rate</div>

            {/* Step 1 */}
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: rate1Valid ? 'var(--success)' : 'var(--gold)', color: 'white', fontSize: 11, fontWeight: 800, marginRight: 6 }}>1</span>
                Enter New Rate (AED per gram)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}>AED</span>
                <input className="input-field yellow-cell" style={{ paddingLeft: 52, fontSize: 22, fontWeight: 700 }}
                  type="number" inputMode="decimal" placeholder="e.g. 550" value={rate1}
                  onChange={e => { setRate1(e.target.value); setSaved(false); setRate2(''); setTouched2(false); }} />
                {rate1Valid && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>✅</span>}
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ opacity: rate1Valid ? 1 : 0.35, pointerEvents: rate1Valid ? 'auto' : 'none', transition: 'opacity 0.3s ease' }}>
              <label className="input-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: match ? 'var(--success)' : mismatch ? 'var(--error)' : 'var(--gold)', color: 'white', fontSize: 11, fontWeight: 800, marginRight: 6 }}>2</span>
                Confirm Rate — Re-enter to verify
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: mismatch ? 'var(--error)' : 'var(--gold-dark)', transition: 'color 0.2s' }}>AED</span>
                <input className="input-field yellow-cell" style={{ paddingLeft: 52, fontSize: 22, fontWeight: 700, borderColor: match ? 'var(--success)' : mismatch ? 'var(--error)' : undefined, background: match ? '#F0FFF8' : mismatch ? '#FFF5F5' : undefined, transition: 'all 0.2s' }}
                  type="number" inputMode="decimal" placeholder="Re-enter same rate" value={rate2}
                  onChange={e => { setRate2(e.target.value); setTouched2(true); setSaved(false); }}
                  onBlur={() => setTouched2(true)} />
                {match    && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>✅</span>}
                {mismatch && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>❌</span>}
              </div>
              {touched2 && rate2.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: match ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {match ? <>✅ Rates match — ready to save</> : <>❌ Rates do not match</>}
                </div>
              )}
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleSave} disabled={!canSave}
            style={{ fontSize: 16, opacity: canSave ? 1 : 0.45, transition: 'opacity 0.2s', marginBottom: 20 }}>
            {canSave ? `✅ Confirm & Save — AED ${r1}/gram` : '🔒 Enter matching rates to save'}
          </button>

          {/* ── Auto-remind interval ── */}
          <div className="card card-padded" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 6 }}>
              ⏰ Auto-Remind to Update
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
              A reminder popup will appear after this many hours since the last gold rate update.
              Set to <strong>0</strong> to disable.
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  className="input-field"
                  type="number" inputMode="decimal" min="0" step="0.5"
                  placeholder="Hours (0 = off)"
                  value={intervalHours}
                  onChange={e => setIntervalHours(e.target.value)}
                  style={{ paddingRight: 50, fontSize: 18, fontWeight: 700 }}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>hrs</span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={handleSaveInterval}
                style={{ height: 48, paddingLeft: 18, paddingRight: 18, fontWeight: 700, flexShrink: 0 }}
              >
                {intervalSaved ? '✅ Saved' : 'Set'}
              </button>
            </div>

            {/* Preset buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {[0, 4, 8, 12, 24].map(h => (
                <button key={h} onClick={() => setIntervalHours(String(h))}
                  style={{
                    padding: '5px 12px', borderRadius: 8, border: '1.5px solid var(--border)',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: intervalHours === String(h) ? 'var(--gold-bg)' : 'var(--surface)',
                    color: intervalHours === String(h) ? 'var(--gold-dark)' : 'var(--text-secondary)',
                    borderColor: intervalHours === String(h) ? 'var(--gold-border)' : 'var(--border)',
                  }}>
                  {h === 0 ? 'Off' : `${h}h`}
                </button>
              ))}
            </div>

            {currentInterval > 0 && (
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--success)', background: 'var(--success-bg)', borderRadius: 6, padding: '6px 10px' }}>
                ✅ Active: Reminder every <strong>{currentInterval}h</strong> since last update
              </div>
            )}
          </div>

          <div className="hint-box">
            Both entries must match exactly before saving. This prevents accidental typos.
          </div>
        </div>
      </div>
    </div>
  );
}
