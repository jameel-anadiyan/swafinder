import React from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';
import {
  calcGoldAmount, calcMakingCharge, calcNetWeight,
  calcTotalDiamondWeight, getMakingChargeMode, fmtAED, fmt2
} from '../../utils/calculations';
import { SAMPLE_ITEM } from '../../data/seedData';

export default function MakingChargeSettings() {
  const { userData, dispatch, goBack } = useApp();
  const ch = userData?.charges || {};
  const gold = userData?.goldPrice;

  const update = (key, val) => {
    const num = parseFloat(val);
    dispatch({ type: 'UPDATE_CHARGES', payload: { [key]: isNaN(num) ? val : num } });
  };

  // Live preview using sample piece
  const sample = userData?.sampleItem || SAMPLE_ITEM;
  const diagWeightCt = calcTotalDiamondWeight(sample.diamonds);
  const netWt = calcNetWeight(sample.grossWeightG, diagWeightCt, sample.otherStoneWeightCt);
  const goldAmt = calcGoldAmount(gold?.ratePerGram || 550, netWt);
  const makingCharge = calcMakingCharge(netWt, goldAmt, ch);
  const mode = getMakingChargeMode(netWt, ch);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Making Charge" onBack={goBack} />

      <div className="screen-scroll">
        <div className="screen-content">
          <div className="card card-padded" style={{ marginBottom: 16 }}>
            <div className="section-header" style={{ paddingTop: 0 }}>Fields</div>

            <div className="input-group">
              <label className="input-label">Making Charge % (MC%)</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field yellow-cell"
                  type="number"
                  inputMode="decimal"
                  placeholder="25"
                  value={ch.makingChargePercent ?? ''}
                  onChange={e => update('makingChargePercent', e.target.value)}
                  style={{ paddingRight: 36 }}
                />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-dark)', fontWeight: 700, fontSize: 14 }}>%</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Applied as: Gold Amount × MC% (when piece is outside net-weight band)
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Net-Wt Min (g)</label>
                <input
                  className="input-field yellow-cell"
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={ch.mcNetWtMin ?? ''}
                  onChange={e => update('mcNetWtMin', e.target.value)}
                />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Net-Wt Max (g)</label>
                <input
                  className="input-field yellow-cell"
                  type="number"
                  inputMode="decimal"
                  placeholder="1.5"
                  value={ch.mcNetWtMax ?? ''}
                  onChange={e => update('mcNetWtMax', e.target.value)}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Fixed Minimum Making Charge (AED)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: 'var(--gold-dark)' }}>AED</span>
                <input
                  className="input-field yellow-cell"
                  style={{ paddingLeft: 50 }}
                  type="number"
                  inputMode="decimal"
                  placeholder="200"
                  value={ch.mcFixedMinCharge ?? ''}
                  onChange={e => update('mcFixedMinCharge', e.target.value)}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Used when piece net-weight is within [{ch.mcNetWtMin ?? 0}g – {ch.mcNetWtMax ?? 1.5}g]
              </div>
            </div>
          </div>

          {/* Rule explanation */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Rule
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              If <strong>Net Weight ∈ [{ch.mcNetWtMin ?? 0}g, {ch.mcNetWtMax ?? 1.5}g]</strong>
              <br />→ Charge = <span style={{ color: 'var(--error)', fontWeight: 700 }}>AED {ch.mcFixedMinCharge ?? 200} fixed</span>
              <br /><br />
              If <strong>Net Weight outside that range</strong>
              <br />→ Charge = <span style={{ color: 'var(--success)', fontWeight: 700 }}>Gold Amount × {ch.makingChargePercent ?? 25}%</span>
            </div>
          </div>

          {/* Live Preview */}
          <div className="preview-box">
            <div className="preview-box-label">Live Preview — Sample Piece SKU 28790</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Net Weight: <strong>{fmt2(netWt)} g</strong> · Gold Amount: <strong>{fmtAED(goldAmt)}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="preview-box-value">{fmtAED(makingCharge)}</div>
              <span className={`badge ${mode === 'fixed' ? 'badge-error' : 'badge-success'}`}>
                {mode === 'fixed' ? 'Fixed Min' : '% of Gold'}
              </span>
            </div>
            <div className="preview-box-mode">
              {mode === 'fixed'
                ? `Net Wt ${fmt2(netWt)}g is within band → using Fixed Min AED ${ch.mcFixedMinCharge}`
                : `Net Wt ${fmt2(netWt)}g is outside band → using ${ch.makingChargePercent}% of Gold Amount`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
