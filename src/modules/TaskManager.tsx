import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Task } from '../context/AppContext';

export default function TaskManager() {
  const { tasks, currentUser, updateTask } = useAppContext();
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Mine') return t.assigneeId === currentUser?.id;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'badge-green';
      case 'In Progress': return 'badge-blue';
      default: return 'badge-gold';
    }
  };

  const toggleStatus = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    updateTask({ ...task, status: newStatus });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>Task Management</h2>
          <p className="text-dim">Track and update GO-BRICS operational tasks.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn-outline ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')} style={{ background: filter === 'All' ? 'var(--gold)' : '', color: filter === 'All' ? 'var(--onyx)' : '' }}>All Tasks</button>
          <button className={`btn-outline ${filter === 'Mine' ? 'active' : ''}`} onClick={() => setFilter('Mine')} style={{ background: filter === 'Mine' ? 'var(--gold)' : '', color: filter === 'Mine' ? 'var(--onyx)' : '' }}>My Tasks</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredTasks.map(task => (
          <div key={task.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: task.grade === 'S' ? '4px solid var(--gold)' : '' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-gold">{task.id}</span>
                {task.grade === 'S' && <span className="badge badge-red">Grade S</span>}
                <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
              </div>
              <h3 style={{ fontSize: '18px' }}>{task.title}</h3>
              <p className="text-dim" style={{ fontSize: '13px', marginTop: '4px' }}>Value: {task.gbp} GBP</p>
            </div>
            
            <button className="btn-outline" onClick={() => toggleStatus(task)}>
              Mark {task.status === 'Completed' ? 'In Progress' : 'Completed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
