import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmtDatetime } from '../utils/calculations';

export default function GoldPriceGate() {
  const { state, userData, dispatch, navigate } = useApp();
  const user = state.currentUser;
  const existing = userData?.goldPrice;

  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [touched2, setTouched2] = useState(false);

  const r1 = parseFloat(rate1);
  const r2 = parseFloat(rate2);

  const rate1Valid = !isNaN(r1) && r1 > 0;
  const rate2Valid = !isNaN(r2) && r2 > 0;
  const match      = rate1Valid && rate2Valid && r1 === r2;
  const mismatch   = touched2 && rate2.length > 0 && rate1Valid && rate2Valid && r1 !== r2;
  const canSave    = match;

  const handleContinue = () => {
    if (!canSave) return;
    dispatch({ type: 'SET_GOLD_PRICE', rate: r1 });
    navigate('home');
  };

  if (!user) return null;

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      position: 'relative',
    }}>
      {/* Blurred background */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)',
        opacity: 0.3,
      }} />

      {/* Bottom sheet modal */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)',
        borderRadius: '28px 28px 0 0',
        padding: '8px 24px 48px',
        animation: 'slideUpModal 0.4s cubic-bezier(.4,0,.2,1) forwards',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        maxHeight: '90%',
        overflowY: 'auto',
      }}>
        <div className="modal-handle" />

        {/* Gold icon */}
        <div style={{
          width: 64, height: 64,
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
          borderRadius: 20, fontSize: 30, marginBottom: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-gold)',
        }}>
          🪙
        </div>

        <h2 className="modal-title">Update 18K Gold Price</h2>
        <p className="modal-sub" style={{ marginBottom: 14 }}>
          Enter today's 18K gold price (AED/gram). Enter it <strong>twice</strong> to confirm — both must match before you can continue.
        </p>

        {existing?.lastUpdated && (
          <div style={{
            background: 'var(--gold-bg)', border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-sm)', padding: '8px 14px',
            fontSize: 12, color: 'var(--gold-dark)', marginBottom: 16,
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            <span>⏱</span>
            Last saved: <strong>AED {existing.ratePerGram}/g</strong> · {fmtDatetime(existing.lastUpdated)}
          </div>
        )}

        {/* ── STEP 1 ── */}
        <div className="input-group" style={{ marginBottom: 14 }}>
          <label className="input-label">
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%',
              background: rate1Valid ? 'var(--success)' : 'var(--gold)',
              color: 'white', fontSize: 11, fontWeight: 800, marginRight: 7,
            }}>1</span>
            Enter Gold Rate (AED / gram)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)',
            }}>AED</span>
            <input
              className="input-field"
              style={{ paddingLeft: 52, paddingRight: 44, fontSize: 20, fontWeight: 700 }}
              type="number"
              inputMode="decimal"
              placeholder="e.g. 550"
              value={rate1}
              autoFocus
              onChange={e => {
                setRate1(e.target.value);
                // Reset confirmation when step 1 changes
                setRate2('');
                setTouched2(false);
              }}
            />
            {rate1Valid && (
              <span style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 18,
              }}>✅</span>
            )}
          </div>
        </div>

        {/* ── STEP 2 ── */}
        <div className="input-group" style={{
          opacity: rate1Valid ? 1 : 0.35,
          pointerEvents: rate1Valid ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          marginBottom: 6,
        }}>
          <label className="input-label">
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%',
              background: match ? 'var(--success)' : mismatch ? 'var(--error)' : 'var(--gold)',
              color: 'white', fontSize: 11, fontWeight: 800, marginRight: 7,
            }}>2</span>
            Confirm Rate — Re-enter to verify
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, fontWeight: 700,
              color: mismatch ? 'var(--error)' : 'var(--gold-dark)',
              transition: 'color 0.2s',
            }}>AED</span>
            <input
              className="input-field"
              style={{
                paddingLeft: 52, paddingRight: 44, fontSize: 20, fontWeight: 700,
                borderColor: match ? 'var(--success)' : mismatch ? 'var(--error)' : undefined,
                background:  match ? '#F0FFF8'         : mismatch ? '#FFF5F5'     : undefined,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              type="number"
              inputMode="decimal"
              placeholder="Re-enter same rate"
              value={rate2}
              onChange={e => { setRate2(e.target.value); setTouched2(true); }}
              onBlur={() => setTouched2(true)}
            />
            {match && (
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>✅</span>
            )}
            {mismatch && (
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>❌</span>
            )}
          </div>

          {/* Live match feedback */}
          {touched2 && rate2.length > 0 && (
            <div style={{
              marginTop: 7, fontSize: 12, fontWeight: 600,
              color: match ? 'var(--success)' : 'var(--error)',
              display: 'flex', alignItems: 'center', gap: 5,
              animation: 'fadeIn 0.2s ease',
            }}>
              {match
                ? <>✅ Rates match — ready to continue</>
                : <>❌ Rates do not match — please re-enter</>}
            </div>
          )}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5, marginTop: 12 }}>
          ℹ️ Both entries must be identical. This prevents accidental typos in your gold rate.
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleContinue}
          disabled={!canSave}
          style={{
            fontSize: 16,
            opacity: canSave ? 1 : 0.45,
            transition: 'opacity 0.2s ease',
          }}
        >
          {canSave
            ? `✅ Confirmed — Continue at AED ${r1}/gram →`
            : '🔒 Enter matching rates to continue'}
        </button>
      </div>
    </div>
  );
}
