import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { ContentItem } from '../context/AppContext';

export default function ContentScheduler() {
  const { content, addContent, skus, currentUser } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({ platform: 'Instagram', persona: 'Arjun', status: 'Draft' });

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Chief Administrator';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.title && newItem.scheduledDate) {
      addContent({ ...newItem, id: Date.now().toString(), gbpEarned: 0 } as ContentItem);
      setShowAdd(false);
      setNewItem({ platform: 'Instagram', persona: 'Arjun', status: 'Draft' });
    }
  };

  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'Instagram': return '#E1306C';
      case 'WhatsApp': return '#25D366';
      case 'Amazon.in': return '#FF9900';
      case 'IndiaMART': return '#0A4A87';
      default: return 'var(--gold)';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>Content Schedule</h2>
          <p className="text-dim">Plan Reels, WhatsApp Broadcasts, and E-comm updates.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          + Schedule Content
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: '32px', display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ gridColumn: '1 / -1' }}><label className="text-dim" style={{ fontSize: '12px' }}>Title / Description</label><input type="text" style={{ width: '100%' }} onChange={e => setNewItem({...newItem, title: e.target.value})} required /></div>
          <div>
            <label className="text-dim" style={{ fontSize: '12px' }}>Platform</label>
            <select style={{ width: '100%' }} onChange={e => setNewItem({...newItem, platform: e.target.value as any})}>
              <option>Instagram</option><option>WhatsApp</option><option>Amazon.in</option><option>IndiaMART</option>
            </select>
          </div>
          <div>
            <label className="text-dim" style={{ fontSize: '12px' }}>Target Persona</label>
            <select style={{ width: '100%' }} onChange={e => setNewItem({...newItem, persona: e.target.value as any})}>
              <option>Arjun</option><option>Priya</option><option>Riya</option>
            </select>
          </div>
          <div>
            <label className="text-dim" style={{ fontSize: '12px' }}>Related SKU</label>
            <select style={{ width: '100%' }} onChange={e => setNewItem({...newItem, sku: e.target.value})}>
              <option value="Multiple">Multiple / General</option>
              {skus.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div><label className="text-dim" style={{ fontSize: '12px' }}>Date</label><input type="date" style={{ width: '100%' }} onChange={e => setNewItem({...newItem, scheduledDate: e.target.value})} required /></div>
          <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn-primary">Save Schedule</button></div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {content.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()).map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '4px', height: '40px', background: getPlatformColor(item.platform), borderRadius: '2px' }}></div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{item.title}</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-dim)' }}>
                  <span>{item.scheduledDate}</span>
                  <span>•</span>
                  <span>{item.platform}</span>
                  <span>•</span>
                  <span>Persona: {item.persona}</span>
                  <span>•</span>
                  <span>{item.sku}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className={`badge ${item.status === 'Published' ? 'badge-green' : 'badge-gold'}`}>{item.status}</span>
              {isAdmin && item.status !== 'Published' && (
                <button className="btn-outline" style={{ padding: '6px 12px' }}>Approve & Publish</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
