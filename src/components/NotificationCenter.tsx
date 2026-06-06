import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function NotificationCenter() {
  const { notifications, markNotificationRead } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 20);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', position: 'relative' }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--gold)', color: 'var(--onyx)', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '320px', background: 'var(--charcoal)', border: '1px solid var(--stone)', borderRadius: '8px', zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--stone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', margin: 0 }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentNotifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>No recent activity</div>
            ) : (
              recentNotifications.map(n => (
                <div 
                  key={n.id} 
                  style={{ padding: '12px 16px', borderBottom: '1px solid var(--stone)', background: n.read ? 'transparent' : 'rgba(200, 169, 110, 0.05)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => {
                    if (!n.read) markNotificationRead(n.id);
                  }}
                >
                  <div style={{ fontSize: '13px', color: n.read ? 'var(--text-dim)' : 'var(--text)' }}>{n.message}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{new Date(n.timestamp).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
