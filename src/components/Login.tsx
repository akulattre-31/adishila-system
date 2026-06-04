import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { users, login } = useAppContext();

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--onyx)' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '8px', color: 'var(--gold)' }}>AdiShila</h1>
        <p className="text-dim" style={{ marginBottom: '32px' }}>Operational Tech Stack • Team #4703</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {users.map(u => (
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
