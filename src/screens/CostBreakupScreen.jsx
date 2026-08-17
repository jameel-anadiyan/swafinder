import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NavBar, { StatusBar } from '../components/NavBar';
import { calcBreakup, fmtAED, fmt2 } from '../utils/calculations';

// ─── Warning Audio + Arabic TTS ───────────────────────────────────────────────
function playLimitAlert() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const tone = (freq, startTime, duration, volume = 0.45) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        gain.gain.setValueAtTime(volume, startTime + duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.start(startTime); osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      tone(880, now, 0.18); tone(660, now + 0.22, 0.18); tone(440, now + 0.44, 0.30);
      setTimeout(() => { try { ctx.close(); } catch {} }, 1200);
    }
  } catch (e) { console.warn('audio unavailable', e); }

  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utt = new SpeechSynthesisUtterance('تم الوصول إلى حد الخصم. لا يمكننا تغطية التكلفة بأقل من هذا.');
      utt.lang = 'ar-SA'; utt.rate = 0.88; utt.volume = 1.0;
      window.speechSynthesis.speak(utt);
    }, 800);
  } catch (e) { console.warn('speech unavailable', e); }
}

// ─── Bilingual Limit Popup ────────────────────────────────────────────────────
function DiscountLimitPopup({ onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fadeIn 0.2s ease forwards',
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        animation: 'scaleIn 0.25s cubic-bezier(.34,1.56,.64,1) forwards',
      }}>
        <div style={{ background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)', padding: '20px 20px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>Discount Limit Reached</div>
        </div>
        <div style={{ padding: '20px 20px 8px' }}>
          <div style={{ background: '#FEF9F0', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--error)', marginBottom: 6 }}>English</div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
              Discount limit reached.<br /><span style={{ color: 'var(--error)', fontWeight: 700 }}>Below this, we cannot cover the cost.</span>
            </div>
          </div>
          <div style={{ background: '#FEF9F0', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 20, direction: 'rtl' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--error)', marginBottom: 6, direction: 'ltr' }}>Arabic / عربي</div>
            <div style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7, fontWeight: 500, fontFamily: 'serif' }}>
              تم الوصول إلى حد الخصم.<br /><span style={{ color: 'var(--error)', fontWeight: 700 }}>لا يمكننا تغطية التكلفة بأقل من هذا.</span>
            </div>
          </div>
          <button className="btn btn-primary btn-full" onClick={onClose}
            style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--error), #922B21)', boxShadow: 'none' }}>
            Understood / حسناً
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Salesman Private Info Modal ──────────────────────────────────────────────
function StaffInfoModal({ costPrice, customerPrice, discountAmt, finalPrice, onClose }) {
  const margin = customerPrice - costPrice;
  const marginPct = ((margin / costPrice) * 100).toFixed(1);
  const savedByDiscount = discountAmt;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      animation: 'fadeIn 0.2s ease forwards',
    }}>
      <div style={{
        background: '#0D1117', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', width: '100%',
        border: '1px solid rgba(184,134,11,0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        animation: 'scaleIn 0.25s cubic-bezier(.34,1.56,.64,1) forwards',
      }}>
        {/* Header */}
        <div style={{ background: 'rgba(184,134,11,0.12)', padding: '14px 18px', borderBottom: '1px solid rgba(184,134,11,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>👁</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#F5C518' }}>Staff Reference — Confidential</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Not visible to customer · Do not share</div>
          </div>
        </div>

        <div style={{ padding: '16px 18px' }}>
          {[
            { label: 'Actual Cost Price', value: fmtAED(costPrice), color: 'rgba(255,255,255,0.6)', sub: 'What it costs us' },
            { label: 'Customer Price (before discount)', value: fmtAED(customerPrice), color: '#F5C518', sub: 'Price shown to customer' },
            { label: 'Margin (Markup)', value: `${fmtAED(margin)} (${marginPct}%)`, color: '#34D399', sub: 'Customer Price minus Cost' },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{row.sub}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: row.color }}>{row.value}</div>
            </div>
          ))}

          {savedByDiscount > 0 && (
            <div style={{
              marginTop: 12, background: 'rgba(192,57,43,0.12)',
              border: '1px solid rgba(192,57,43,0.3)', borderRadius: 8, padding: '10px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 12, color: 'rgba(255,100,80,0.9)' }}>Discount given to customer</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#FF6B6B' }}>− {fmtAED(savedByDiscount)}</div>
            </div>
          )}

          <div style={{
            marginTop: 12, background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8, padding: '10px 12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 12, color: 'rgba(52,211,153,0.9)', fontWeight: 700 }}>Final Price collected</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#34D399' }}>{fmtAED(finalPrice)}</div>
          </div>
        </div>

        <div style={{ padding: '0 18px 18px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', height: 42, borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Discount opt-in row (for regular users) ──────────────────────────────────
function DiscountRow({ label, pct, enabled, onToggle, onPctChange, value }) {
  return (
    <div className="breakup-row" style={{ background: enabled ? '#FFF5F5' : 'var(--surface)', flexWrap: 'wrap', gap: 4 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onToggle} style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            border: `2px solid ${enabled ? 'var(--error)' : 'var(--neutral-300)'}`,
            background: enabled ? 'var(--error)' : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s ease',
          }}>
            {enabled && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
          </button>
          <span className="breakup-label" style={{ color: enabled ? 'var(--error)' : 'var(--text-muted)', fontWeight: enabled ? 600 : 400, margin: 0 }}>{label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input className="td-input" type="number" value={pct}
              onChange={e => onPctChange(e.target.value)}
              style={{ width: 44, background: enabled ? '#FFECEC' : '#FFFBEA', borderColor: enabled ? '#F5A0A0' : '#E0C84A' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>%</span>
          </div>
        </div>
        {!enabled && <div style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 30 }}>Click ☑ to apply</div>}
      </div>
      <div className="breakup-value" style={{ color: enabled ? 'var(--error)' : 'var(--text-muted)' }}>
        {enabled ? fmtAED(value) : '—'}
      </div>
    </div>
  );
}

// ─── SWA Burjman Simplified Breakup ──────────────────────────────────────────
function BurjmanBreakup({ bp, item, updateItem, navigate, showPopup, setShowPopup }) {
  const [showStaff, setShowStaff] = useState(false);

  const MAX_DISCOUNT = 10;
  const specialPrice = bp.grandTotal * 1.5;
  const discPct = parseFloat(item.specialDiscountPct) || 0;
  const discountAmt = specialPrice * (discPct / 100);
  const finalPrice = specialPrice - discountAmt;

  const handleDiscount = (val) => {
    let num = parseFloat(val) || 0;
    const hitLimit = num >= MAX_DISCOUNT;
    if (num > MAX_DISCOUNT) num = MAX_DISCOUNT;
    updateItem({ specialDiscountPct: num });
    if (hitLimit) { playLimitAlert(); setShowPopup(true); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      {showPopup && <DiscountLimitPopup onClose={() => setShowPopup(false)} />}
      {showStaff && (
        <StaffInfoModal
          costPrice={bp.grandTotal}
          customerPrice={specialPrice}
          discountAmt={discountAmt}
          finalPrice={finalPrice}
          onClose={() => setShowStaff(false)}
        />
      )}

      <div className="screen-scroll">
        <div style={{ padding: '12px 12px 0' }}>

          {/* ── Product Details ── */}
          <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
            <div className="breakup-section-title">Product Details</div>
            <div className="breakup-row">
              <div className="breakup-label">SKU</div>
              <input className="td-input" type="text" value={item.sku} style={{ width: 100 }}
                onChange={e => updateItem({ sku: e.target.value })} />
            </div>
            <div className="breakup-row">
              <div className="breakup-label">Barcode</div>
              <input className="td-input" type="text" value={item.barcode} style={{ width: 110 }}
                onChange={e => updateItem({ barcode: e.target.value })} />
            </div>
            <div className="breakup-row">
              <div className="breakup-label">Gross Weight (g)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input className="td-input" type="number" inputMode="decimal" value={item.grossWeightG} style={{ width: 70 }}
                  onChange={e => updateItem({ grossWeightG: parseFloat(e.target.value) || 0 })} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>g</span>
              </div>
            </div>
            <div className="breakup-row">
              <div className="breakup-label">Net Weight (g)</div>
              <div className="breakup-value">{fmt2(bp.netWeightG)} g</div>
            </div>
            <div className="breakup-row">
              <div className="breakup-label">Diamond Weight (ct)</div>
              <div className="breakup-value">{fmt2(bp.totalDiamondWeightCt)} ct</div>
            </div>
            <div className="breakup-row">
              <div className="breakup-label">Metal / Karat</div>
              <div className="breakup-value">{item.metal} · {item.karat}</div>
            </div>
          </div>

          {/* ── Special Price Box (clean — no markup mention) ── */}
          <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
            <div className="breakup-section-title" style={{ color: '#B8860B' }}>Price</div>

            {/* Discount input — no label about markup */}
            <div className="breakup-row" style={{ flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <div className="breakup-label" style={{ flex: 1 }}>Customer Discount</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number" inputMode="decimal"
                  className="td-input"
                  value={item.specialDiscountPct || 0}
                  min="0"
                  onChange={e => handleDiscount(e.target.value)}
                  style={{
                    width: 56, fontSize: 16, fontWeight: 700, textAlign: 'center',
                    background: discPct > 0 ? '#FFECEC' : 'var(--surface)',
                    borderColor: discPct > 0 ? '#F5A0A0' : undefined,
                  }}
                />
                <span style={{ fontSize: 13, color: 'var(--error)', fontWeight: 700 }}>%</span>
                {discPct >= MAX_DISCOUNT && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--error)', background: 'var(--error-bg)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 4, padding: '2px 6px' }}>MAX</span>
                )}
              </div>
              {discPct > 0 && (
                <div style={{ width: '100%', textAlign: 'right', fontSize: 12, color: 'var(--error)', fontWeight: 600 }}>
                  − {fmtAED(discountAmt)}
                </div>
              )}
            </div>

            {/* Final Price */}
            <div style={{
              background: 'linear-gradient(135deg, #1C1914 0%, #2A2318 100%)',
              padding: '14px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F5C518', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Final Price
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#F5C518' }}>
                {fmtAED(finalPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* Print button + Staff button row */}
        <div style={{ padding: '4px 12px 32px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-primary" style={{ flex: 1, fontSize: 15 }}
            onClick={() => navigate('printslip')}>
            🖨 Print Slip
          </button>

          {/* Discreet salesman button */}
          <button
            onClick={() => setShowStaff(true)}
            title="Staff Reference"
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: 'rgba(184,134,11,0.1)',
              border: '1.5px solid rgba(184,134,11,0.25)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,134,11,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(184,134,11,0.1)'}
          >
            👁
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Cost Breakup Screen ─────────────────────────────────────────────────
export default function CostBreakupScreen() {
  const { userData, dispatch, navigate, goBack, state } = useApp();
  const user = state.currentUser;
  const isSpecial = user?.isSpecial;
  const gold = userData?.goldPrice;
  const charges = userData?.charges || {};
  const vis = userData?.fieldVisibility?.breakup || {};
  const item = userData?.sampleItem;

  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const updateItem = (payload) => dispatch({ type: 'UPDATE_SAMPLE_ITEM', payload });
  const updateDiamond = (id, payload) => dispatch({ type: 'UPDATE_DIAMOND_IN_ITEM', id, payload });

  if (!item) return null;

  const goldRate = gold?.ratePerGram || 550;
  const bp = calcBreakup(item, goldRate, charges, userData?.diamondChart);
  const show = (key) => vis[key] !== false;

  // ── SWA Burjman: show simplified view ──────────────────────────────────────
  if (isSpecial) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards', minHeight: 0 }}>
        <StatusBar />
        <NavBar title="Price Breakup" onBack={goBack} rightAction={{ label: '🖨 Print', onClick: () => navigate('printslip') }} />
        <BurjmanBreakup
          bp={bp} item={item} updateItem={updateItem} navigate={navigate}
          showPopup={showLimitPopup} setShowPopup={setShowLimitPopup}
        />
      </div>
    );
  }

  // ── Standard full breakup (all other users) ────────────────────────────────
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards', minHeight: 0, position: 'relative' }}>
      <StatusBar />
      <NavBar title="Cost Breakup" onBack={goBack} rightAction={{ label: '🖨 Print', onClick: () => navigate('printslip') }} />

      <div className="screen-scroll">
        {/* Header info bar */}
        <div style={{ background: 'var(--surface)', padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${user?.accentColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💍</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Brilliant Diamond Ring</div>
            <div className="gold-chip" style={{ fontSize: 11, marginTop: 4, display: 'inline-flex' }}>
              <span className="gold-chip-dot" />18K Gold: AED {goldRate}/g
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 12px 0' }}>
          {/* PRODUCT DETAILS */}
          <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
            <div className="breakup-section-title">Product Details</div>
            {show('sku') && <div className="breakup-row"><div className="breakup-label">SKU</div><input className="td-input" type="text" value={item.sku} style={{ width: 100 }} onChange={e => updateItem({ sku: e.target.value })} /></div>}
            {show('barcode') && <div className="breakup-row"><div className="breakup-label">Barcode</div><input className="td-input" type="text" value={item.barcode} style={{ width: 110 }} onChange={e => updateItem({ barcode: e.target.value })} /></div>}
            {show('grossWeight') && <div className="breakup-row"><div className="breakup-label">Gross Weight (g)</div><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input className="td-input" type="number" inputMode="decimal" value={item.grossWeightG} style={{ width: 70 }} onChange={e => updateItem({ grossWeightG: parseFloat(e.target.value) || 0 })} /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>g</span></div></div>}
            {show('otherWeight') && (
              <div className="breakup-row" style={{ background: '#FFF8F0' }}>
                <div className="breakup-label">
                  Other Deduction (g)
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 6 }}>− from gross</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input className="td-input" type="number" inputMode="decimal"
                    value={item.otherWeightG ?? 0} style={{ width: 70, borderColor: '#F0A040' }}
                    onChange={e => updateItem({ otherWeightG: parseFloat(e.target.value) || 0 })} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>g</span>
                </div>
              </div>
            )}
            {show('netWeight') && <div className="breakup-row"><div className="breakup-label">Net Weight (g)</div><div className="breakup-value">{fmt2(bp.netWeightG)} g</div></div>}
            {show('diamondWeight') && <div className="breakup-row"><div className="breakup-label">Diamond Weight (ct)</div><div className="breakup-value">{fmt2(bp.totalDiamondWeightCt)} ct</div></div>}
            {show('otherStoneWeight') && <div className="breakup-row"><div className="breakup-label">Other Stone (ct)</div><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input className="td-input" type="number" inputMode="decimal" value={item.otherStoneWeightCt} style={{ width: 70 }} onChange={e => updateItem({ otherStoneWeightCt: parseFloat(e.target.value) || 0 })} /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>ct</span></div></div>}
          </div>

          {/* DIAMOND DETAILS */}
          <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
            <div className="breakup-section-title">Diamond Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 40px 60px 76px 72px', gap: 4, padding: '6px 14px', background: 'var(--neutral-100)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <div>Size</div><div>Qty</div><div>Carat</div><div>CT Price</div><div>Amount</div>
            </div>
            {bp.diamonds.map(d => (
              <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '2fr 40px 60px 76px 72px', gap: 4, padding: '7px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.size}</div>
                {show('dQty') && <input className="td-input" type="number" value={d.qty} style={{ width: 36, padding: '0 4px' }} onChange={e => updateDiamond(d.id, { qty: parseInt(e.target.value) || 0 })} />}
                {show('dCarat') && <input className="td-input" type="number" inputMode="decimal" value={d.caratTotal} style={{ width: 56 }} onChange={e => updateDiamond(d.id, { caratTotal: parseFloat(e.target.value) || 0 })} />}
                {show('dCtPrice') && <input className="td-input" type="number" value={d.ctPrice} style={{ width: 72 }} onChange={e => updateDiamond(d.id, { ctPrice: parseFloat(e.target.value) || 0 })} />}
                {show('dAmount') && <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 12 }}>{d.amount.toFixed(2)}</div>}
              </div>
            ))}
            {show('totalDiamondAmt') && <div className="breakup-row" style={{ background: 'var(--neutral-50)' }}><div className="breakup-label" style={{ fontWeight: 700 }}>Total Diamond Amount</div><div className="breakup-value" style={{ fontWeight: 800 }}>{fmtAED(bp.totalDiamondAmount)}</div></div>}
            {show('discountDiamond') && <DiscountRow label="Discount on Diamond" pct={item.diamondDiscountPct} enabled={!!item.diamondDiscountEnabled} onToggle={() => updateItem({ diamondDiscountEnabled: !item.diamondDiscountEnabled })} onPctChange={v => updateItem({ diamondDiscountPct: parseFloat(v) || 0 })} value={bp.discountOnDiamond} />}
          </div>

          {/* METAL DETAILS */}
          <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
            <div className="breakup-section-title">Metal (Gold) Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, padding: '6px 14px', background: 'var(--neutral-100)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {show('metal') && <div>Metal</div>}{show('karat') && <div>Karat</div>}{show('ratePerG') && <div>Rate/g</div>}{show('netWtMetal') && <div>Net Wt</div>}{show('goldAmount') && <div>Amount</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, padding: '8px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 12 }}>
              {show('metal') && <div style={{ fontWeight: 600 }}>{item.metal}</div>}
              {show('karat') && <div style={{ fontWeight: 600, color: 'var(--gold-dark)' }}>{item.karat}</div>}
              {show('ratePerG') && <div style={{ fontWeight: 600 }}>{goldRate}</div>}
              {show('netWtMetal') && <div>{fmt2(bp.netWeightG)}g</div>}
              {show('goldAmount') && <div style={{ fontWeight: 700 }}>{fmtAED(bp.goldAmount)}</div>}
            </div>
            {show('makingCharge') && <div className="breakup-row"><div className="breakup-label">Making Charge<span className={`badge ${bp.makingChargeMode === 'fixed' ? 'badge-error' : 'badge-success'}`} style={{ marginLeft: 6, fontSize: 10 }}>{bp.makingChargeMode === 'fixed' ? 'Fixed' : `${charges.makingChargePercent}%`}</span></div><div className="breakup-value">{fmtAED(bp.makingCharge)}</div></div>}
            {show('discountMaking') && <DiscountRow label="Discount on Making" pct={item.makingDiscountPct} enabled={!!item.makingDiscountEnabled} onToggle={() => updateItem({ makingDiscountEnabled: !item.makingDiscountEnabled })} onPctChange={v => updateItem({ makingDiscountPct: parseFloat(v) || 0 })} value={bp.discountOnMaking} />}
          </div>

          {/* OTHER STONE */}
          {(show('osStone') || show('osCarat') || show('osAmount')) && (
            <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
              <div className="breakup-section-title">Other Stone</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, padding: '6px 14px', background: 'var(--neutral-100)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {show('osStone') && <div>Stone</div>}{show('osCarat') && <div>Carat</div>}{show('osRatePerCt') && <div>Rate/ct</div>}{show('osAmount') && <div>Amount</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, padding: '8px 14px', alignItems: 'center', fontSize: 12 }}>
                {show('osStone') && <div style={{ fontWeight: 600 }}>{item.otherStoneName}</div>}
                {show('osCarat') && <div>{item.otherStoneWeightCt} ct</div>}
                {show('osRatePerCt') && <div>{charges.otherStoneRatePerCt}/ct</div>}
                {show('osAmount') && <div style={{ fontWeight: 700 }}>{fmtAED(bp.otherStoneAmount)}</div>}
              </div>
            </div>
          )}

          {/* COST SUMMARY */}
          <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
            <div className="breakup-section-title">Cost Summary</div>
            {show('sumDiamondAmt') && <div className="breakup-row"><div className="breakup-label">Diamond Amount</div><div className="breakup-value">{fmtAED(bp.totalDiamondAmount)}</div></div>}
            {show('sumDiscDiamond') && item.diamondDiscountEnabled && <div className="breakup-row"><div className="breakup-label" style={{ color: 'var(--error)' }}>Less: Discount on Diamond ({item.diamondDiscountPct}%)</div><div className="breakup-value negative">{fmtAED(bp.discountOnDiamond)}</div></div>}
            {show('sumGoldAmt') && <div className="breakup-row"><div className="breakup-label">Gold / Metal Amount</div><div className="breakup-value">{fmtAED(bp.goldAmount)}</div></div>}
            {show('sumMakingCharge') && <div className="breakup-row"><div className="breakup-label">Making Charge</div><div className="breakup-value">{fmtAED(bp.makingCharge)}</div></div>}
            {show('sumDiscMaking') && item.makingDiscountEnabled && <div className="breakup-row"><div className="breakup-label" style={{ color: 'var(--error)' }}>Less: Discount on Making ({item.makingDiscountPct}%)</div><div className="breakup-value negative">{fmtAED(bp.discountOnMaking)}</div></div>}
            {show('sumOtherStone') && <div className="breakup-row"><div className="breakup-label">Other Stone Amount</div><div className="breakup-value">{fmtAED(bp.otherStoneAmount)}</div></div>}
            {show('certCharge') && charges.includeCertification && <div className="breakup-row"><div className="breakup-label">Certification Charge</div><div className="breakup-value">{fmtAED(bp.certCharge)}</div></div>}
            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            {show('subtotal') && <div className="breakup-row" style={{ background: 'var(--neutral-50)' }}><div className="breakup-label" style={{ fontWeight: 700 }}>Subtotal (before VAT)</div><div className="breakup-value" style={{ fontWeight: 800, fontSize: 15 }}>{fmtAED(bp.subtotal)}</div></div>}
            {show('vat') && <div className="breakup-row"><div className="breakup-label">VAT 5%</div><div className="breakup-value">{fmtAED(bp.vat)}</div></div>}
            {show('grandTotal') && <div className="breakup-total-row"><div className="breakup-total-label">Grand Total</div><div className="breakup-total-value">{fmtAED(bp.grandTotal)}</div></div>}
          </div>
        </div>

        <div style={{ padding: '0 12px 32px' }}>
          <button className="btn btn-primary btn-full" style={{ fontSize: 16 }} onClick={() => navigate('printslip')}>
            🖨 Preview & Print Slip
          </button>
        </div>
      </div>
    </div>
  );
}
