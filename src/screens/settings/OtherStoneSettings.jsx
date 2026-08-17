import React from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';

export default function OtherStoneSettings() {
  const { userData, dispatch, goBack } = useApp();
  const ch = userData?.charges || {};

  const update = (val) => {
    const num = parseFloat(val);
    dispatch({ type: 'UPDATE_CHARGES', payload: { otherStoneRatePerCt: isNaN(num) ? 0 : num } });
  };

  // Live preview: sample piece has 0.20 ct other stone
  const sampleCt = 0.20;
  const rate = parseFloat(ch.otherStoneRatePerCt) || 0;
  const previewAmt = (sampleCt * rate).toFixed(2);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Other Stone Charge" onBack={goBack} />

      <div className="screen-scroll">
        <div className="screen-content">
          <div className="card card-padded" style={{ marginBottom: 16 }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Other Stone Rate (AED / carat)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}>AED</span>
                <input
                  className="input-field yellow-cell"
                  style={{ paddingLeft: 52, fontSize: 20, fontWeight: 700 }}
                  type="number"
                  inputMode="decimal"
                  placeholder="50"
                  value={ch.otherStoneRatePerCt ?? ''}
                  onChange={e => update(e.target.value)}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
                Other Stone Amount = Stone Weight (ct) × Rate/ct
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="preview-box">
            <div className="preview-box-label">Live Preview — Sample Piece (0.20 ct)</div>
            <div className="preview-box-value">AED {previewAmt}</div>
            <div className="preview-box-mode">
              {sampleCt} ct × AED {rate}/ct = AED {previewAmt}
            </div>
          </div>

          <div className="hint-box" style={{ marginTop: 16 }}>
            Default rate is <strong>AED 50/ct</strong>. This applies to all other (non-diamond) stones in the piece. The carat weight is entered during scan.
          </div>
        </div>
      </div>
    </div>
  );
}
