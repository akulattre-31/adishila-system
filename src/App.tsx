import { useState, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import NotificationCenter from './components/NotificationCenter';
import TaskManager from './modules/TaskManager';
import CRM from './modules/CRM';
import ContentScheduler from './modules/ContentScheduler';
import Analytics from './modules/Analytics';
import Communication from './modules/Communication';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('ErrorBoundary caught an error', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
          <h2>Module failed to load</h2>
          <p>Please reload the page.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const { currentUser, loading, error } = useAppContext();
  const [activeModule, setActiveModule] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--onyx)', color: 'var(--gold)' }}>
        <h2>Loading system...</h2>
      </div>
    );
  }

  if (!currentUser) return <Login />;

  const renderModule = () => {
    switch(activeModule) {
      case 'dashboard': return <ErrorBoundary><Analytics /></ErrorBoundary>;
      case 'tasks': return <ErrorBoundary><TaskManager /></ErrorBoundary>;
      case 'crm': return <ErrorBoundary><CRM /></ErrorBoundary>;
      case 'content': return <ErrorBoundary><ContentScheduler /></ErrorBoundary>;
      case 'analytics': return <ErrorBoundary><Analytics /></ErrorBoundary>;
      case 'communication': return <ErrorBoundary><Communication /></ErrorBoundary>;
      default: return <ErrorBoundary><Analytics /></ErrorBoundary>;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="main-content">
        {error && (
          <div style={{ background: '#ff6b6b', color: 'white', padding: '12px 24px', marginBottom: '24px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ Firestore Error: {error}</span>
            <button style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '4px 8px', borderRadius: '2px', cursor: 'pointer' }} onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <NotificationCenter />
          </div>
          {renderModule()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
