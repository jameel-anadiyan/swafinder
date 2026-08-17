import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NavBar, { StatusBar } from '../components/NavBar';

export default function ScanScreen() {
  const { navigate, goBack, dispatch } = useApp();
  const [sku, setSku] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleLoad = () => {
    // Always reset special discount to 0 on each new scan load
    dispatch({ type: 'UPDATE_SAMPLE_ITEM', payload: { specialDiscountPct: 0 } });
    navigate('costbreakup');
  };

  const handleScanAnim = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setSku('28790');
    }, 1500);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)', animation: 'slideInRight 0.3s ease forwards' }}>
      <StatusBar />
      <NavBar title="Scan Jewellery" onBack={goBack} />

      <div className="screen-scroll">
        <div style={{ padding: '24px 20px' }}>
          {/* Camera Frame */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="scan-frame" style={{ margin: '0 auto 16px' }}>
              <div className="scan-frame-inner">
                {/* Camera grid overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }} />

                {scanning ? (
                  <div className="scan-line" />
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 12 }}>Camera preview</div>
                  </div>
                )}

                {sku && !scanning && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(26,122,74,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                    <div style={{ fontSize: 32 }}>✅</div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>SKU {sku}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Item found</div>
                  </div>
                )}
              </div>

              {/* Corner decorations */}
              <div className="scan-corner tl" />
              <div className="scan-corner tr" />
              <div className="scan-corner bl" />
              <div className="scan-corner br" />
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {scanning ? 'Scanning barcode…' : 'Point camera at jewellery barcode'}
            </div>
          </div>

          {/* Simulate scan button */}
          <button
            className="btn btn-primary btn-full"
            onClick={handleScanAnim}
            disabled={scanning}
            style={{ marginBottom: 16 }}
          >
            {scanning ? (
              <><div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> Scanning…</>
            ) : (
              <>📷 Simulate Scan (Demo)</>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Manual entry */}
          <div className="input-group">
            <label className="input-label">Enter SKU / Barcode Manually</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input-field"
                style={{ flex: 1 }}
                type="text"
                placeholder="e.g. 28790"
                value={sku}
                onChange={e => setSku(e.target.value)}
              />
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSku('28790')}
                style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-sm)' }}
              >
                Use Demo
              </button>
            </div>
          </div>

          {/* Load button */}
          {sku && (
            <div style={{ animation: 'fadeIn 0.3s ease forwards' }}>
              <div style={{
                background: 'var(--success-bg)',
                border: '1px solid rgba(26,122,74,0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
                  ✅ Item Ready
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <strong>SKU {sku}</strong> — Brilliant Diamond Ring
                  <br />Gross Wt: 2.5g · 4 diamond rows · 18K Gold
                </div>
              </div>

              <button
                className="btn btn-primary btn-full"
                onClick={handleLoad}
                style={{ fontSize: 16 }}
              >
                📊 View Cost Breakup →
              </button>
            </div>
          )}

          <div className="hint-box" style={{ marginTop: 20 }}>
            <strong>Demo mode:</strong> Tap "Simulate Scan" or enter SKU <code>28790</code> to load the sample Brilliant Diamond Ring and see the live cost breakup.
          </div>
        </div>
      </div>
    </div>
  );
}
