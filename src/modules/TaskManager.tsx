import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Task } from '../context/AppContext';

export default function TaskManager() {
  const { tasks, currentUser, updateTask, users } = useAppContext();
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

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

  const getGradeColor = (grade?: string) => {
    if (grade === 'S') return 'var(--gold)';
    return 'var(--text-dim)';
  };

  const getAssigneeName = (id?: string) => {
    return users.find(u => u.id === id)?.name || 'Unassigned';
  };

  const toggleStatus = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    updateTask({ ...task, status: newStatus as any });
  };

  const handleAddComment = (e: React.FormEvent, task: any) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    const comment = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      text: newComment,
      timestamp: new Date().toISOString()
    };
    updateTask({ ...task, comments: [...(task.comments || []), comment] });
    setNewComment('');
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
          <div className="card" key={task.id} style={{ padding: '16px', borderLeft: `4px solid ${getGradeColor(task.grade)}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setShowModal(task.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', lineHeight: 1.3 }}>{task.id} — {task.title}</h4>
                <span className="badge" style={{ background: 'var(--charcoal)', color: 'var(--gold)' }}>+{task.gbp} GBP</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
                Assignee: {getAssigneeName(task.assigneeId)}
                {task.comments?.length > 0 && <span style={{ marginLeft: '8px', color: 'var(--gold)' }}>({task.comments.length} comments)</span>}
              </div>
            </div>
            
            <button className="btn-outline" onClick={() => toggleStatus(task)}>
              Mark {task.status === 'Completed' ? 'In Progress' : 'Completed'}
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{tasks.find(t => t.id === showModal)?.title} - Comments</h3>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowModal(null)}>×</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.find(t => t.id === showModal)?.comments?.length === 0 ? (
                <div style={{ color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>No comments yet.</div>
              ) : (
                tasks.find(t => t.id === showModal)?.comments?.map(c => (
                  <div key={c.id} style={{ background: 'var(--charcoal)', padding: '12px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{getAssigneeName(c.authorId)}</span>
                      <span style={{ color: 'var(--text-dim)' }}>{new Date(c.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: 1.4 }}>{c.text}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={e => handleAddComment(e, tasks.find(t => t.id === showModal))} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Type a comment..." style={{ flex: 1 }} />
              <button type="submit" className="btn-primary">Send</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
