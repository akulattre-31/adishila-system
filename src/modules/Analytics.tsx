import { useAppContext } from '../context/AppContext';

export default function Analytics() {
  const { users, skus } = useAppContext();
  
  // Mock Data for Breakeven Tracker
  const currentUnits = 120;
  const targetUnits = 1000;
  const progressPercent = Math.min((currentUnits / targetUnits) * 100, 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>Analytics & GBP Leaderboard</h2>
          <p className="text-dim">Track sales volume, margins, and team performance.</p>
        </div>
        <button className="btn-outline">Export Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Breakeven Tracker */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Monthly Volume & Breakeven Tracker</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span>Current: <strong className="text-gold">{currentUnits} units</strong></span>
            <span className="text-dim">Target: {targetUnits} units</span>
          </div>
          <div style={{ height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-dk), var(--gold-lt))', transition: 'width 1s ease' }}></div>
            
            {/* Threshold Markers */}
            <div style={{ position: 'absolute', left: '5%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(255,255,255,0.3)' }} title="50: Marginal"></div>
            <div style={{ position: 'absolute', left: '20%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(255,255,255,0.3)' }} title="200: Viable"></div>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(255,255,255,0.3)' }} title="500: Strong"></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-dim)' }}>
            <span>0</span>
            <span style={{ marginLeft: '-40%' }}>50 (Marginal)</span>
            <span style={{ marginLeft: '-15%' }}>200 (Viable)</span>
            <span style={{ marginLeft: '10%' }}>500 (Strong)</span>
            <span>1000</span>
          </div>
        </div>

        {/* GBP Leaderboard */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Team #4703 Leaderboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {users.sort((a, b) => b.gbp - a.gbp).map((u, i) => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i === 0 ? 'var(--gold)' : 'var(--stone)', color: i === 0 ? 'var(--onyx)' : 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{u.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>{u.gbp} <span style={{ fontSize: '10px' }}>GBP</span></div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>SKU Margin & Pricing Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stone)', color: 'var(--text-dim)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 8px' }}>SKU Name</th>
                <th style={{ padding: '12px 8px' }}>Wholesale (MWP)</th>
                <th style={{ padding: '12px 8px' }}>MRP</th>
                <th style={{ padding: '12px 8px' }}>Margin</th>
                <th style={{ padding: '12px 8px' }}>MOQ</th>
                <th style={{ padding: '12px 8px' }}>GBP / Sale</th>
              </tr>
            </thead>
            <tbody>
              {skus.map(sku => (
                <tr key={sku.id} style={{ borderBottom: '1px solid var(--stone)' }}>
                  <td style={{ padding: '16px 8px', fontWeight: 500 }}>{sku.name}</td>
                  <td style={{ padding: '16px 8px', color: 'var(--text-dim)' }}>₹{sku.mwp}</td>
                  <td style={{ padding: '16px 8px' }}>₹{sku.mrp}</td>
                  <td style={{ padding: '16px 8px', color: '#5DB075', fontWeight: 600 }}>{sku.margin}</td>
                  <td style={{ padding: '16px 8px', fontSize: '13px' }}>{sku.moq}</td>
                  <td style={{ padding: '16px 8px', color: 'var(--gold)', fontWeight: 600 }}>{sku.gbpRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
