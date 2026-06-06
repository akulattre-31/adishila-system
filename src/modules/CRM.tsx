import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Lead } from '../context/AppContext';

export default function CRM() {
  const { leads, skus, users, addLead, updateLead, assignLead, currentUser } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [assignDropdown, setAssignDropdown] = useState<string | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ tier: 'B2B', status: 'Cold' });

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Chief Administrator';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTier, setFilterTier] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');
  
  const [sortField, setSortField] = useState<keyof Lead | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLead.name && newLead.city) {
      addLead({ ...newLead, id: Date.now().toString(), lastContact: new Date().toISOString().split('T')[0] } as Lead);
      setShowAdd(false);
      setNewLead({ tier: 'B2B', status: 'Cold' });
    }
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAndSortedLeads = leads
    .filter(l => {
      const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.phone.includes(searchTerm);
      const matchStatus = filterStatus === 'All' || l.status === filterStatus;
      const matchTier = filterTier === 'All' || l.tier === filterTier;
      const matchAssignee = filterAssignee === 'All' || l.assigneeName === filterAssignee || (!l.assigneeName && filterAssignee === 'Unassigned');
      return matchSearch && matchStatus && matchTier && matchAssignee;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

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

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by name, city, phone..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Cold">Cold</option>
          <option value="Warm">Warm</option>
          <option value="Hot">Hot</option>
          <option value="Converted">Converted</option>
        </select>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)}>
          <option value="All">All Tiers</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
        </select>
        <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}>
          <option value="All">All Assignees</option>
          {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--stone)', color: 'var(--text-dim)', fontSize: '12px', textTransform: 'uppercase', userSelect: 'none' }}>
              <th style={{ padding: '12px 8px', cursor: 'pointer' }} onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortAsc ? '↑' : '↓')}</th>
              <th style={{ padding: '12px 8px', cursor: 'pointer' }} onClick={() => handleSort('city')}>City/Tier {sortField === 'city' && (sortAsc ? '↑' : '↓')}</th>
              <th style={{ padding: '12px 8px' }}>Interest</th>
              <th style={{ padding: '12px 8px', cursor: 'pointer' }} onClick={() => handleSort('lastContact')}>Last Contact {sortField === 'lastContact' && (sortAsc ? '↑' : '↓')}</th>
              <th style={{ padding: '12px 8px', cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortAsc ? '↑' : '↓')}</th>
              <th style={{ padding: '12px 8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedLeads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid var(--stone)' }}>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>{lead.phone}</div>
                  {lead.assigneeName && (
                    <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--gold)' }}>
                      Assignee: {lead.assigneeName}
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <div>{lead.city}</div>
                  <span className={`badge ${lead.tier === 'B2B' ? 'badge-blue' : 'badge-gold'}`}>{lead.tier}</span>
                </td>
                <td style={{ padding: '16px 8px', fontSize: '13px' }}>{lead.skuInterest} <div style={{color: 'var(--text-dim)'}}>{lead.source}</div></td>
                <td style={{ padding: '16px 8px', fontSize: '13px' }}>{lead.lastContact}</td>
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
                <td style={{ padding: '16px 8px', position: 'relative' }}>
                  {isAdmin && (
                    <>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '10px' }}
                        onClick={() => setAssignDropdown(assignDropdown === lead.id ? null : lead.id)}
                      >
                        {lead.assigneeId ? 'Reassign' : 'Assign'}
                      </button>
                      
                      {assignDropdown === lead.id && (
                        <div style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', background: 'var(--charcoal)', border: '1px solid var(--stone)', padding: '8px', borderRadius: '4px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px', width: '150px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase' }}>Select User</div>
                          {users.map(u => (
                            <button 
                              key={u.id}
                              style={{ textAlign: 'left', padding: '4px 8px', fontSize: '12px', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '2px' }}
                              onClick={() => {
                                assignLead(lead.id, u.id);
                                setAssignDropdown(null);
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              {u.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-dim)' }}>
        Showing {filteredAndSortedLeads.length} of {leads.length} leads
      </div>
    </div>
  );
}
