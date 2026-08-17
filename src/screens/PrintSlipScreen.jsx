import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NavBar, { StatusBar } from '../components/NavBar';
import { calcBreakup, fmtAED, fmt2, fmtDatetime } from '../utils/calculations';

// ─── Burjman Clean Print Slip ─────────────────────────────────────────────────
function BurjmanPrintSlip({ bp, item, user, goBack }) {
  const [printMode, setPrintMode] = useState(false);

  const specialPrice = bp.grandTotal * 1.5;
  const discPct = parseFloat(item.specialDiscountPct) || 0;
  const discountAmt = specialPrice * (discPct / 100);
  const finalPrice = specialPrice - discountAmt;

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => { window.print(); setPrintMode(false); }, 100);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Print Slip" onBack={goBack} />

      <div className="screen-scroll">
        {!printMode && (
          <div className="no-print" style={{ margin: '12px 12px 0', padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>
              ℹ️ This slip shows <strong>product details and final price only</strong> — no internal calculations are printed.
            </div>
            <button className="btn btn-primary btn-full" style={{ height: 42, fontSize: 14 }} onClick={handlePrint}>
              🖨 Print / Export
            </button>
          </div>
        )}

        {/* ── Print Slip ── */}
        <div style={{
          margin: '12px 12px 32px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
        }}>
          {/* Brand header */}
          <div style={{
            background: `linear-gradient(135deg, ${user?.accentColor || '#B8860B'} 0%, ${user?.accentColor || '#8B6914'}CC 100%)`,
            padding: '18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'var(--font-serif)', letterSpacing: -0.5 }}>
              {user?.brandName}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              Premium Diamond Jewellery · Dubai, UAE
            </div>
          </div>

          <div style={{ borderBottom: '2px dashed var(--border)', margin: '0 16px' }} />

          <div style={{ padding: '14px 16px' }}>
            {/* Date + SKU row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>SKU: {item.sku}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.barcode}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Product basic details */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginBottom: 12 }}>
              <SlipRow label="Gross Weight" value={`${item.grossWeightG} g`} />
              <SlipRow label="Net Weight"   value={`${fmt2(bp.netWeightG)} g`} />
              <SlipRow label="Metal / Karat" value={`${item.metal} · ${item.karat}`} />
              <SlipRow label="Diamond Weight" value={`${fmt2(bp.totalDiamondWeightCt)} ct`} />
            </div>

            {/* Price section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              {discPct > 0 && (
                <>
                  <SlipRow label="Price" value={fmtAED(specialPrice)} />
                  <SlipRow label={`Discount (${discPct}%)`} value={`− ${fmtAED(discountAmt)}`} isNeg />
                </>
              )}
            </div>

            {/* Final price banner */}
            <div style={{
              background: 'linear-gradient(135deg, var(--gold-bg) 0%, #FFF5E0 100%)',
              border: '1.5px solid var(--gold-border)', borderRadius: 10,
              padding: '12px 14px', marginTop: 10,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold-dark)' }}>Total Price</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--gold-dark)' }}>{fmtAED(finalPrice)}</span>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 14, paddingTop: 10, borderTop: '2px dashed var(--border)', textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Thank you for your purchase<br />
              All prices inclusive of applicable taxes<br />
              <strong style={{ color: 'var(--gold-dark)' }}>SWA Burjman · Dubai</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Standard Print Slip (all other users) ────────────────────────────────────
export default function PrintSlipScreen() {
  const { userData, goBack, state } = useApp();
  const user = state.currentUser;
  const isSpecial = user?.isSpecial;
  const gold = userData?.goldPrice;
  const charges = userData?.charges || {};
  const printVis = userData?.fieldVisibility?.print || {};
  const item = userData?.sampleItem;

  const [discDiamondOn, setDiscDiamondOn] = useState(false);
  const [discMakingOn, setDiscMakingOn]   = useState(false);
  const [applied, setApplied]             = useState(false);
  const [printMode, setPrintMode]         = useState(false);

  if (!item) return null;

  const goldRate = gold?.ratePerGram || 550;
  const bp = calcBreakup(item, goldRate, charges, userData?.diamondChart);

  // SWA Burjman gets its own clean slip
  if (isSpecial) return <BurjmanPrintSlip bp={bp} item={item} user={user} goBack={goBack} />;

  // ── Standard print slip ──────────────────────────────────────────────────────
  const effectiveDiscDiamond = (discDiamondOn && applied) ? bp.discountOnDiamond : 0;
  const effectiveDiscMaking  = (discMakingOn  && applied) ? bp.discountOnMaking  : 0;
  const subtotal    = bp.totalDiamondAmount + effectiveDiscDiamond + bp.goldAmount + bp.makingCharge + effectiveDiscMaking + bp.otherStoneAmount + bp.certCharge;
  const vat         = subtotal * 0.05;
  const grandTotal  = subtotal + vat;

  const show = (key) => printVis[key] !== false;

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => { window.print(); setPrintMode(false); }, 100);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Print Slip Preview" onBack={goBack} />

      <div className="screen-scroll">
        {/* Discount opt-in controls */}
        {!printMode && (
          <div className="no-print" style={{ margin: '12px 12px 0', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 10 }}>
              Opt-in Discounts for This Slip
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
              Tick discounts to apply. Un-ticked discounts are excluded entirely.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={discDiamondOn} onChange={e => { setDiscDiamondOn(e.target.checked); setApplied(false); }} style={{ width: 18, height: 18, accentColor: 'var(--gold)' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Discount on Diamond ({item.diamondDiscountPct}%)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{discDiamondOn && applied ? <span style={{ color: 'var(--error)' }}>−{fmtAED(Math.abs(bp.discountOnDiamond))}</span> : 'Not applied'}</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={discMakingOn} onChange={e => { setDiscMakingOn(e.target.checked); setApplied(false); }} style={{ width: 18, height: 18, accentColor: 'var(--gold)' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Discount on Making ({item.makingDiscountPct}%)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{discMakingOn && applied ? <span style={{ color: 'var(--error)' }}>−{fmtAED(Math.abs(bp.discountOnMaking))}</span> : 'Not applied'}</div>
                </div>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1, height: 40, fontSize: 13, borderRadius: 'var(--radius-sm)' }} onClick={() => setApplied(true)}>✓ Apply</button>
              <button className="btn btn-primary"   style={{ flex: 2, height: 40, fontSize: 13, borderRadius: 'var(--radius-sm)' }} onClick={handlePrint}>🖨 Print</button>
            </div>
          </div>
        )}

        {/* ── Slip ── */}
        <div style={{ margin: '12px 12px 32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ background: `linear-gradient(135deg, ${user?.accentColor || '#1C1914'} 0%, ${user?.accentColor || '#2A2318'}CC 100%)`, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'var(--font-serif)', letterSpacing: -0.5 }}>{user?.brandName}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Premium Diamond Jewellery · Dubai, UAE</div>
          </div>

          <div style={{ borderBottom: '2px dashed var(--border)', margin: '0 16px' }} />

          <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                {show('sku') && <div style={{ fontSize: 13, fontWeight: 700 }}>SKU: {item.sku}</div>}
                {show('barcode') && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>Barcode: {item.barcode}</div>}
              </div>
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
                <div>{new Date().toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                <div>18K Gold: AED {goldRate}/g</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginBottom: 10 }}>
              {show('grossWeight') && <SlipRow label="Gross Weight" value={`${item.grossWeightG} g`} />}
              {show('netWeight')   && <SlipRow label="Net Weight"   value={`${fmt2(bp.netWeightG)} g`} />}
              {show('diamondWeight') && <SlipRow label="Diamond Weight" value={`${fmt2(bp.totalDiamondWeightCt)} ct`} />}
              {show('otherStoneWeight') && <SlipRow label="Other Stone" value={`${item.otherStoneWeightCt} ct`} />}
            </div>

            {bp.diamonds.some(() => show('dSize') || show('dAmount')) && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 4 }}>Diamond Details</div>
                {bp.diamonds.map(d => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', borderBottom: '1px dotted var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{show('dSize') && d.size}{show('dQty') && ` ×${d.qty}`}{show('dCarat') && ` (${d.caratTotal}ct)`}</span>
                    {show('dAmount') && <span style={{ fontWeight: 600 }}>AED {d.amount.toFixed(2)}</span>}
                  </div>
                ))}
                {show('totalDiamondAmt') && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', fontWeight: 700, marginTop: 2 }}><span>Total Diamond</span><span>{fmtAED(bp.totalDiamondAmount)}</span></div>}
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginBottom: 8 }}>
              {show('sumGoldAmt')    && <SlipRow label={`Gold (${item.karat} @ ${goldRate}/g × ${fmt2(bp.netWeightG)}g)`} value={fmtAED(bp.goldAmount)} />}
              {show('sumMakingCharge') && <SlipRow label={`Making (${bp.makingChargeMode === 'fixed' ? 'Fixed' : charges.makingChargePercent + '%'})`} value={fmtAED(bp.makingCharge)} />}
              {show('sumOtherStone')   && <SlipRow label="Other Stone" value={fmtAED(bp.otherStoneAmount)} />}
              {show('certCharge') && charges.includeCertification && <SlipRow label="Certification" value={fmtAED(bp.certCharge)} />}
              {discDiamondOn && applied && <SlipRow label={`Discount Diamond (${item.diamondDiscountPct}%)`} value={fmtAED(bp.discountOnDiamond)} isNeg />}
              {discMakingOn  && applied && <SlipRow label={`Discount Making (${item.makingDiscountPct}%)`}   value={fmtAED(bp.discountOnMaking)}  isNeg />}
            </div>

            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 8 }}>
              {show('subtotal') && <SlipRow label="Subtotal (before VAT)" value={fmtAED(subtotal)} bold />}
              {show('vat')      && <SlipRow label="VAT 5%" value={fmtAED(vat)} />}
            </div>

            <div style={{ background: 'linear-gradient(135deg, var(--gold-bg) 0%, #FFF5E0 100%)', border: '1.5px solid var(--gold-border)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold-dark)' }}>Grand Total</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--gold-dark)' }}>{fmtAED(grandTotal)}</span>
            </div>

            <div style={{ marginTop: 14, paddingTop: 10, borderTop: '2px dashed var(--border)', textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Thank you for your purchase<br />All prices inclusive of 5% UAE VAT<br />
              <strong style={{ color: 'var(--gold-dark)' }}>Powered by SWA Finder</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlipRow({ label, value, isNeg, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', alignItems: 'baseline' }}>
      <span style={{ color: 'var(--text-secondary)', flex: 1, fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600, color: isNeg ? 'var(--error)' : 'var(--text-primary)', fontSize: bold ? 14 : 12, marginLeft: 8, whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}
