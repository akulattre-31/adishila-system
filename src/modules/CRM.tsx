import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Lead } from '../context/AppContext';

export default function CRM() {
  const { leads, skus, addLead, updateLead, currentUser } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ tier: 'B2B', status: 'Cold' });

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Chief Administrator';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLead.name && newLead.city) {
      addLead({ ...newLead, id: Date.now().toString(), lastContact: new Date().toISOString().split('T')[0] } as Lead);
      setShowAdd(false);
      setNewLead({ tier: 'B2B', status: 'Cold' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>CRM & Lead Pipeline</h2>
          <p className="text-dim">Manage B2B and B2C inquiries across channels.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          + Log New Lead
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: '32px', display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
          <div><label className="text-dim" style={{ fontSize: '12px' }}>Name</label><input type="text" style={{ width: '100%' }} onChange={e => setNewLead({...newLead, name: e.target.value})} required /></div>
          <div><label className="text-dim" style={{ fontSize: '12px' }}>City</label><input type="text" style={{ width: '100%' }} onChange={e => setNewLead({...newLead, city: e.target.value})} required /></div>
          <div><label className="text-dim" style={{ fontSize: '12px' }}>Tier</label><select style={{ width: '100%' }} onChange={e => setNewLead({...newLead, tier: e.target.value as any})}><option>B2B</option><option>B2C</option></select></div>
          <div><label className="text-dim" style={{ fontSize: '12px' }}>SKU Interest</label><select style={{ width: '100%' }} onChange={e => setNewLead({...newLead, skuInterest: e.target.value})}><option value="">Select SKU</option>{skus.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select></div>
          <div><label className="text-dim" style={{ fontSize: '12px' }}>Phone / WhatsApp</label><input type="text" style={{ width: '100%' }} onChange={e => setNewLead({...newLead, phone: e.target.value})} required /></div>
          <div><label className="text-dim" style={{ fontSize: '12px' }}>Source</label><input type="text" style={{ width: '100%' }} onChange={e => setNewLead({...newLead, source: e.target.value})} placeholder="e.g. IndiaMART, Instagram" required /></div>
          <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn-primary">Save Lead</button></div>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--stone)', color: 'var(--text-dim)', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 8px' }}>Name</th>
              <th style={{ padding: '12px 8px' }}>City/Tier</th>
              <th style={{ padding: '12px 8px' }}>Interest</th>
              <th style={{ padding: '12px 8px' }}>Source</th>
              <th style={{ padding: '12px 8px' }}>Status</th>
              <th style={{ padding: '12px 8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid var(--stone)' }}>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>{lead.phone}</div>
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <div>{lead.city}</div>
                  <span className={`badge ${lead.tier === 'B2B' ? 'badge-blue' : 'badge-gold'}`}>{lead.tier}</span>
                </td>
                <td style={{ padding: '16px 8px', fontSize: '13px' }}>{lead.skuInterest}</td>
                <td style={{ padding: '16px 8px', fontSize: '13px' }}>{lead.source}</td>
                <td style={{ padding: '16px 8px' }}>
                  <select 
                    style={{ background: 'transparent', border: '1px solid var(--stone)', color: 'inherit', padding: '4px', borderRadius: '4px' }}
                    value={lead.status}
                    onChange={(e) => updateLead({ ...lead, status: e.target.value as any })}
                  >
                    <option value="Cold">Cold</option>
                    <option value="Warm">Warm</option>
                    <option value="Hot">Hot</option>
                    <option value="Converted">Converted</option>
                  </select>
                </td>
                <td style={{ padding: '16px 8px' }}>
                  {isAdmin && <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '10px' }}>Assign</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
