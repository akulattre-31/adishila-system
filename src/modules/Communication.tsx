import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../context/AppContext';

export default function Communication() {
  const { announcements, addAnnouncement, addSystemAnnouncement, currentUser, completeOnboarding } = useAppContext();
  const [newAnn, setNewAnn] = useState('');
  const [checklist, setChecklist] = useState<boolean[]>([false, false, false, false]);
  const [warning, setWarning] = useState('');

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Chief Administrator';

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.id, 'onboarding', 'data'), (snap) => {
      if (snap.exists()) {
        setChecklist(snap.data().checklist || [false, false, false, false]);
      } else {
        setChecklist([false, false, false, false]);
      }
    });
    return () => unsub();
  }, [currentUser]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnn.trim()) {
      addAnnouncement(newAnn);
      setNewAnn('');
    }
  };

  const toggleCheck = async (index: number) => {
    if (!currentUser) return;
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
    setWarning('');
    try {
      await setDoc(doc(db, 'users', currentUser.id, 'onboarding', 'data'), { checklist: newChecklist }, { merge: true });
    } catch(e) { console.error(e); }
  };

  const handleCompleteOnboarding = () => {
    if (checklist.every(Boolean)) {
      completeOnboarding();
      const dateStr = new Date().toISOString().split('T')[0];
      addSystemAnnouncement(`${currentUser?.name} has completed onboarding — ${dateStr}`);
    } else {
      setWarning('Please complete all checklist items before marking onboarding complete.');
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
                <input type="checkbox" style={{ marginTop: '4px' }} checked={checklist[0]} onChange={() => toggleCheck(0)} disabled={currentUser?.onboardingComplete} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Set up profile</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Update name, city, WhatsApp number.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} checked={checklist[1]} onChange={() => toggleCheck(1)} disabled={currentUser?.onboardingComplete} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Read Sales Guide</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Review AdiShila personas and objection-handling.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} checked={checklist[2]} onChange={() => toggleCheck(2)} disabled={currentUser?.onboardingComplete} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Review 7 SKU Library</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Familiarize with MRP, margins, and MOQs.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '4px' }} checked={checklist[3]} onChange={() => toggleCheck(3)} disabled={currentUser?.onboardingComplete} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Log First CRM Lead</div>
                  <div className="text-dim" style={{ fontSize: '12px' }}>Add a B2B or B2C contact to the pipeline.</div>
                </div>
              </label>
            </div>
            {warning && <div style={{ marginTop: '12px', color: '#ff6b6b', fontSize: '12px' }}>{warning}</div>}
            
            {currentUser?.onboardingComplete ? (
              <button className="btn-primary" style={{ width: '100%', marginTop: '24px', background: '#5DB075', cursor: 'default' }} disabled>
                ✅ Onboarding Complete
              </button>
            ) : (
              <button className="btn-primary" style={{ width: '100%', marginTop: '24px' }} onClick={handleCompleteOnboarding}>
                Complete Onboarding
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
