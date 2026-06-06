import { useAppContext } from '../context/AppContext';

export default function Analytics() {
  const { users, skus, leads, tasks, content, currentUser, seedFirestore } = useAppContext();
  
  const isChiefAdmin = currentUser?.role === 'Chief Administrator';
  
  const handleExport = () => {
    let csv = "AdiShila System Export\n\n";
    
    // 1. CRM Pipeline
    csv += "--- CRM PIPELINE ---\n";
    csv += "Name,City,Tier,SKU Interest,Phone,Source,Status,Last Contact\n";
    leads.forEach(l => {
      csv += `"${l.name}","${l.city}","${l.tier}","${l.skuInterest}","${l.phone}","${l.source}","${l.status}","${l.lastContact}"\n`;
    });
    csv += "\n";
    
    // 2. Task Summary
    csv += "--- TASK SUMMARY ---\n";
    csv += "ID,Title,Grade,GBP Value,Status\n";
    tasks.forEach(t => {
      csv += `"${t.id}","${t.title}","${t.grade}","${t.gbp}","${t.status}"\n`;
    });
    csv += "\n";
    
    // 3. GBP Leaderboard
    csv += "--- GBP LEADERBOARD ---\n";
    csv += "Name,Role,GBP Earned\n";
    users.forEach(u => {
      csv += `"${u.name}","${u.role}","${u.gbp}"\n`;
    });
    csv += "\n";
    
    // 4. Content Pipeline
    csv += "--- CONTENT PIPELINE ---\n";
    csv += "Title,Platform,Persona,Date,Status\n";
    content.forEach(c => {
      csv += `"${c.title}","${c.platform}","${c.persona}","${c.scheduledDate}","${c.status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `AdiShila_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Mock Data for Breakeven Tracker
  const currentUnits = 120;
  const targetUnits = 1000;
  const progressPercent = Math.min((currentUnits / targetUnits) * 100, 100);

  // Chart A: Pipeline Funnel Data
  const funnelData = [
    { stage: 'Cold', count: leads.filter(l => l.status === 'Cold').length },
    { stage: 'Warm', count: leads.filter(l => l.status === 'Warm').length },
    { stage: 'Hot', count: leads.filter(l => l.status === 'Hot').length },
    { stage: 'Converted', count: leads.filter(l => l.status === 'Converted').length }
  ];
  const maxFunnel = Math.max(...funnelData.map(d => d.count), 1);

  // Chart B: Content Timeline Data (Next 30 Days)
  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);
  
  const timelineContent = content.filter(c => {
    const d = new Date(c.scheduledDate);
    return d >= today && d <= next30Days;
  }).sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>Analytics & GBP Leaderboard</h2>
          <p className="text-dim">Track sales volume, margins, and team performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isChiefAdmin && (
            <button className="btn-outline" style={{ borderColor: 'var(--gold)' }} onClick={seedFirestore}>Seed Initial Data</button>
          )}
          <button className="btn-outline" onClick={handleExport}>Export Report</button>
        </div>
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
            {users.sort((a, b) => b.gbp - a.gbp).map((u) => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Pipeline Funnel Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Pipeline Funnel</h3>
          <div style={{ display: 'flex', height: '200px', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '24px', borderBottom: '1px solid var(--stone)' }}>
            {funnelData.map((d) => {
              const heightPct = (d.count / maxFunnel) * 100;
              return (
                <div key={d.stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 'bold', marginBottom: '8px' }}>{d.count}</div>
                  <div style={{ 
                    width: '100%', 
                    height: `${heightPct}%`, 
                    minHeight: '4px',
                    background: 'linear-gradient(180deg, var(--gold-lt) 0%, var(--gold-dk) 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease'
                  }}></div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-dim)' }}>{d.stage}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Timeline Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Content Pipeline (Next 30 Days)</h3>
          <div style={{ position: 'relative', height: '200px', padding: '20px 0' }}>
            {/* Timeline axis */}
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--stone)' }}></div>
            
            {timelineContent.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '60px' }}>No content scheduled in next 30 days</div>
            ) : (
              timelineContent.map((c, i) => {
                const itemDate = new Date(c.scheduledDate);
                const diffTime = Math.abs(itemDate.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const leftPct = (diffDays / 30) * 100;
                
                return (
                  <div 
                    key={c.id} 
                    style={{ position: 'absolute', left: `${leftPct}%`, top: i % 2 === 0 ? '20%' : '60%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                    title={`${c.title} - ${c.platform}`}
                  >
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '4px', whiteSpace: 'nowrap' }}>{c.scheduledDate.substring(5)}</div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold)', border: '2px solid var(--charcoal)', zIndex: 2 }}></div>
                    <div style={{ width: '1px', height: i % 2 === 0 ? 'calc(50% - 10px)' : '0', background: 'var(--stone)', position: 'absolute', top: '100%', left: '50%' }}></div>
                    <div style={{ width: '1px', height: i % 2 === 1 ? 'calc(50% - 10px)' : '0', background: 'var(--stone)', position: 'absolute', bottom: '100%', left: '50%' }}></div>
                    <div style={{ fontSize: '11px', color: 'var(--cream)', marginTop: '4px', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.platform}</div>
                  </div>
                );
              })
            )}
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
