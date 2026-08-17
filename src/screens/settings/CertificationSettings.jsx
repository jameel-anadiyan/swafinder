import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import NavBar, { StatusBar } from '../../components/NavBar';

export default function CertificationSettings() {
  const { userData, dispatch, goBack } = useApp();
  const ch = userData?.charges || {};
  const [amount, setAmount] = useState(String(ch.certificationCharge ?? 150));

  const handleAmountChange = (v) => {
    setAmount(v);
    const num = parseFloat(v);
    if (!isNaN(num)) dispatch({ type: 'UPDATE_CHARGES', payload: { certificationCharge: num } });
  };

  const handleToggle = (val) => {
    dispatch({ type: 'UPDATE_CHARGES', payload: { includeCertification: val } });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Certification Charge" onBack={goBack} />

      <div className="screen-scroll">
        <div className="screen-content">
          <div className="card card-padded" style={{ marginBottom: 16 }}>
            <div className="input-group" style={{ marginBottom: 20 }}>
              <label className="input-label">Certification Charge (AED)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}>AED</span>
                <input
                  className="input-field yellow-cell"
                  style={{ paddingLeft: 52, fontSize: 18, fontWeight: 700 }}
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => handleAmountChange(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Include in Cost Breakup</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Adds certification charge as a separate line in the breakup
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={!!ch.includeCertification}
                  onChange={e => handleToggle(e.target.checked)}
                />
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
              </label>
            </div>
          </div>

          {/* Live Preview */}
          <div className="preview-box">
            <div className="preview-box-label">Certification Line in Breakup</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="preview-box-value">
                {ch.includeCertification ? `AED ${parseFloat(amount) || 0}` : 'Not included'}
              </div>
              <span className={`badge ${ch.includeCertification ? 'badge-success' : 'badge-error'}`}>
                {ch.includeCertification ? 'Active' : 'Off'}
              </span>
            </div>
            <div className="preview-box-mode">
              {ch.includeCertification
                ? 'Will appear as "Add Certification Charge" in the cost summary'
                : 'Toggle ON to include this charge in pricing'}
            </div>
          </div>

          <div className="hint-box" style={{ marginTop: 16 }}>
            The certification charge is controlled by the <strong>Break-Up Settings</strong> and <strong>Print Settings</strong> toggles for visibility.
          </div>
        </div>
      </div>
    </div>
  );
}
