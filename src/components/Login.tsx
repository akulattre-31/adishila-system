import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { users, login, error } = useAppContext();

  // Fallback to mock users if DB is empty so we can log in to seed
  const displayUsers = users.length > 0 ? users : [
    { id: 'u1', name: 'Demo Member', role: 'Member' },
    { id: 'u2', name: 'Sales Lead Admin', role: 'Admin' },
    { id: 'u3', name: 'Chief Administrator', role: 'Chief Administrator' }
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--onyx)' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '8px', color: 'var(--gold)' }}>AdiShila</h1>
        <p className="text-dim" style={{ marginBottom: '32px' }}>Operational Tech Stack • Team #4703</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {error && <div style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '8px' }}>Firestore Error: {error}</div>}
          {displayUsers.map(u => (
            <button
              key={u.id}
              className="btn-outline"
              onClick={() => login(u.id)}
            >
              Log in as {u.name} ({u.role})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
