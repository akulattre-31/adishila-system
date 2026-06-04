import { LayoutDashboard, CheckSquare, Users, Calendar, BarChart3, MessageSquare, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar({ activeModule, setActiveModule }: { activeModule: string, setActiveModule: (m: string) => void }) {
  const { currentUser, logout } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'content', label: 'Content Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'communication', label: 'Communication Hub', icon: MessageSquare },
  ];

  return (
    <div style={{ width: '260px', background: 'var(--charcoal)', borderRight: '1px solid var(--stone)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--stone)' }}>
        <h2 style={{ color: 'var(--gold)', margin: 0 }}>AdiShila</h2>
        <span className="text-dim" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Team #4703</span>
      </div>

      <nav style={{ padding: '16px 0', flex: 1 }}>
        {navItems.map(item => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: isActive ? 'var(--gold)' : 'var(--text-dim)',
                background: isActive ? 'rgba(200, 169, 110, 0.05)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                textAlign: 'left'
              }}
            >
              <item.icon size={18} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '24px', borderTop: '1px solid var(--stone)' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--cream)' }}>{currentUser?.name}</div>
          <div className="text-dim" style={{ fontSize: '12px' }}>{currentUser?.role}</div>
          <div className="text-gold" style={{ fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>{currentUser?.gbp} GBP Earned</div>
        </div>
        <button className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={logout}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );
}
