import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Communication() {
  const { announcements, addAnnouncement, currentUser } = useAppContext();
  const [newAnn, setNewAnn] = useState('');

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Chief Administrator';

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnn.trim()) {
      addAnnouncement(newAnn);
      setNewAnn('');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '8px' }}>Communication Hub</h2>
        <p className="text-dim">Team announcements and onboarding documents.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Announcements Feed */}
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Announcements</h3>
          
          {isAdmin && (
            <form onSubmit={handlePost} style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={newAnn}
                onChange={(e) => setNewAnn(e.target.value)}
                placeholder="Post an announcement to the team..." 
                style={{ flex: 1 }} 
              />
              <button type="submit" className="btn-primary">Post</button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.map(ann => (
              <div key={ann.id} className="card" style={{ borderLeft: '4px solid var(--gold)' }}>
                <p style={{ fontSize: '15px', marginBottom: '12px', lineHeight: 1.6 }}>{ann.text}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
                  <span>Posted by: <strong style={{ color: 'var(--cream)' }}>{ann.author}</strong></span>
                  <span>{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding Checklist */}
        <div>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Onboarding Checklist</h3>
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Set up profile</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Update name, city, WhatsApp number.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Read Sales Guide</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Review AdiShila personas and objection-handling.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Review 7 SKU Library</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Familiarize with MRP, margins, and MOQs.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Log First CRM Lead</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Add a B2B or B2C contact to the pipeline.</div>
                </div>
              </label>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>Complete Onboarding</button>
          </div>
        </div>

      </div>
    </div>
  );
}
