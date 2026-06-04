import { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import TaskManager from './modules/TaskManager';
import CRM from './modules/CRM';
import ContentScheduler from './modules/ContentScheduler';
import Analytics from './modules/Analytics';
import Communication from './modules/Communication';
import './index.css';

function MainLayout() {
  const { currentUser } = useAppContext();
  const [activeModule, setActiveModule] = useState('dashboard');

  if (!currentUser) return <Login />;

  const renderModule = () => {
    switch(activeModule) {
      case 'dashboard': return <Analytics />; // Overview maps to Analytics for now
      case 'tasks': return <TaskManager />;
      case 'crm': return <CRM />;
      case 'content': return <ContentScheduler />;
      case 'analytics': return <Analytics />;
      case 'communication': return <Communication />;
      default: return <Analytics />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main style={{ flex: 1, padding: '40px 60px', background: 'var(--onyx)', overflowY: 'auto', height: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
