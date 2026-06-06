import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Data Types
export type UserRole = 'Member' | 'Admin' | 'Chief Administrator';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  teamId: string;
  gbp: number;
  onboardingComplete?: boolean;
}

export interface Task {
  id: string;
  title: string;
  grade: 'S' | 'A' | 'B' | 'C';
  gbp: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  assigneeId?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  city: string;
  tier: 'B2B' | 'B2C';
  skuInterest: string;
  phone: string;
  lastContact: string;
  status: 'Cold' | 'Warm' | 'Hot' | 'Converted';
  notes: string;
  source: string;
  assigneeId?: string;
  assigneeName?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: 'Instagram' | 'WhatsApp' | 'Amazon.in' | 'IndiaMART';
  persona: 'Arjun' | 'Priya' | 'Riya';
  sku: string;
  scheduledDate: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  gbpEarned: number;
  authorId?: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SKU {
  id: string;
  name: string;
  mwp: number;
  mrp: number;
  margin: string;
  moq: string;
  persona: string;
  gbpRate: string;
}

// Mock Data
const MOCK_SKUS: SKU[] = [
  { id: '01', name: 'Kavach Shield — OM', mwp: 800, mrp: 1499, margin: '~47%', moq: '50 pcs', persona: 'Arjun, Riya', gbpRate: '75' },
  { id: '02', name: 'Kali Yuga Lingam', mwp: 1700, mrp: 3499, margin: '~51%', moq: '25 pcs', persona: 'Priya, Arjun', gbpRate: '165' },
  { id: '03', name: 'Vastu Dosh Pyramid', mwp: 1100, mrp: 2199, margin: '~50%', moq: '25 pcs', persona: 'Priya', gbpRate: '120' },
  { id: '04', name: 'Rudra-Shila Raksha Mala', mwp: 900, mrp: 1499, margin: '~40%', moq: '50 pcs', persona: 'Arjun', gbpRate: '90' },
  { id: '05', name: 'Amrit Jal Shuddhi Set', mwp: 950, mrp: 1999, margin: '~52%', moq: '25 sets', persona: 'Priya', gbpRate: '105' },
  { id: '06', name: 'Trishul Shield', mwp: 800, mrp: 1499, margin: '~47%', moq: '50 pcs', persona: 'Arjun, Riya', gbpRate: '75' },
  { id: '07', name: 'Shila Raksha Pendant', mwp: 700, mrp: 1299, margin: '~46%', moq: '50 pcs', persona: 'Riya', gbpRate: '75' },
];

const MOCK_TASKS: Task[] = [
  { id: 'T14', title: 'Integrated Tech Stack', grade: 'S', gbp: 380, status: 'In Progress', assigneeId: 'u1', comments: [] },
  { id: 'T15', title: 'TaskPilot Build', grade: 'S', gbp: 450, status: 'In Progress', assigneeId: 'u1', comments: [] },
  { id: 'PR05', title: 'Full Product Research Dossier', grade: 'S', gbp: 320, status: 'Completed', assigneeId: 'u1', comments: [] },
  { id: 'PR04', title: 'Consumer Persona Report', grade: 'A', gbp: 160, status: 'Completed', assigneeId: 'u1', comments: [] },
  { id: 'PP02', title: 'Manufacturing Process Research', grade: 'C', gbp: 55, status: 'Completed', assigneeId: 'u1', comments: [] },
  { id: 'PR02', title: 'Market Demand Validation', grade: 'S', gbp: 0, status: 'Completed', assigneeId: 'u1', comments: [] },
];

const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Ananya Nair', city: 'Bangalore', tier: 'B2B', skuInterest: 'Kavach OM', phone: '+91 98765 43210', lastContact: '2026-06-01', status: 'Warm', notes: 'Yoga Studio Owner - 50 pcs interest', source: 'Instagram' },
  { id: 'l2', name: 'Rajesh Iyer', city: 'Chennai', tier: 'B2B', skuInterest: 'Pyramid + Kavach bundle', phone: '+91 87654 32109', lastContact: '2026-05-28', status: 'Cold', notes: 'Vastu Consultant', source: 'Direct' },
  { id: 'l3', name: 'Priya Verma', city: 'Lucknow', tier: 'B2C', skuInterest: 'Family Pack (4x Kavach)', phone: '+91 76543 21098', lastContact: '2026-06-02', status: 'Hot', notes: 'Homemaker', source: 'WhatsApp' },
  { id: 'l4', name: 'Giri Trading (Spiritual Store)', city: 'Delhi', tier: 'B2B', skuInterest: 'MOQ 50 pcs mixed', phone: '+91 65432 10987', lastContact: '2026-06-03', status: 'Converted', notes: 'Wholesale partner', source: 'IndiaMART' },
  { id: 'l5', name: 'Arjun Sharma', city: 'Bangalore', tier: 'B2C', skuInterest: 'Kavach OM single', phone: '+91 54321 09876', lastContact: '2026-05-30', status: 'Warm', notes: 'IT Pro', source: 'Amazon' },
];

const MOCK_CONTENT: ContentItem[] = [
  { id: 'c1', title: '"What is Shungite?" science explainer', platform: 'Instagram', persona: 'Arjun', sku: 'Multiple', scheduledDate: '2026-06-10', status: 'Scheduled', gbpEarned: 0, authorId: 'u1' },
  { id: 'c2', title: 'Family Kavach Pack Diwali offer (Hindi)', platform: 'WhatsApp', persona: 'Priya', sku: 'Kavach Shield — OM', scheduledDate: '2026-10-15', status: 'Scheduled', gbpEarned: 0, authorId: 'u1' },
  { id: 'c3', title: 'Aesthetic unboxing, gold OM close-up', platform: 'Instagram', persona: 'Riya', sku: 'Kavach Shield — OM', scheduledDate: '2026-06-17', status: 'Scheduled', gbpEarned: 0, authorId: 'u1' },
  { id: 'c4', title: 'Kavach OM listing update', platform: 'Amazon.in', persona: 'Arjun', sku: 'Kavach Shield — OM', scheduledDate: '2026-06-05', status: 'Published', gbpEarned: 0, authorId: 'u1' },
  { id: 'c5', title: 'B2B listing update', platform: 'IndiaMART', persona: 'Arjun', sku: 'Multiple', scheduledDate: '2026-06-08', status: 'Scheduled', gbpEarned: 0, authorId: 'u1' },
];

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Demo Member', role: 'Member', teamId: '#4703', gbp: 535 },
  { id: 'u2', name: 'Sales Lead Admin', role: 'Admin', teamId: '#4703', gbp: 800 },
  { id: 'u3', name: 'Chief Administrator', role: 'Chief Administrator', teamId: 'ALL', gbp: 0 },
];

interface AppContextType {
  currentUser: User | null;
  loading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  skus: SKU[];
  tasks: Task[];
  updateTask: (task: Task) => void;
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  assignLead: (leadId: string, userId: string) => void;
  content: ContentItem[];
  addContent: (content: ContentItem) => void;
  approveContent: (itemId: string) => void;
  users: User[];
  completeOnboarding: () => void;
  announcements: { id: string; text: string; author: string; date: string }[];
  addAnnouncement: (text: string) => void;
  addSystemAnnouncement: (text: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  seedFirestore: () => void;
  error: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for all modules
  const [skus] = useState<SKU[]>(MOCK_SKUS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Local storage for user session
  useEffect(() => {
    const savedUser = localStorage.getItem('adishila_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // Firestore real-time listeners
  useEffect(() => {
    try {
      const unsubTasks = onSnapshot(collection(db, 'tasks'), snap => {
        setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)));
      }, err => setError(err.message));
      
      const unsubLeads = onSnapshot(collection(db, 'leads'), snap => {
        setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead)));
      }, err => setError(err.message));
      
      const unsubContent = onSnapshot(collection(db, 'content'), snap => {
        setContent(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContentItem)));
      }, err => setError(err.message));
      
      const unsubUsers = onSnapshot(collection(db, 'users'), snap => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as User)));
      }, err => setError(err.message));
      
      const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), snap => {
        setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() as any })).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }, err => setError(err.message));

      const unsubNotifications = onSnapshot(collection(db, 'notifications'), snap => {
        setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() as any })).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }, err => setError(err.message));

      // After listeners are established, mark as loaded
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => {
        unsubTasks();
        unsubLeads();
        unsubContent();
        unsubUsers();
        unsubAnnouncements();
        unsubNotifications();
        clearTimeout(timer);
      };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const seedFirestore = async () => {
    try {
      const snap = await getDocs(collection(db, 'leads'));
      if (snap.empty) {
        for (const l of MOCK_LEADS) { await setDoc(doc(db, 'leads', l.id), l); }
        for (const t of MOCK_TASKS) { await setDoc(doc(db, 'tasks', t.id), t); }
        for (const c of MOCK_CONTENT) { await setDoc(doc(db, 'content', c.id), c); }
        for (const u of MOCK_USERS) { await setDoc(doc(db, 'users', u.id), u); }
        await setDoc(doc(db, 'announcements', 'a1'), { id: 'a1', text: 'Welcome to the AdiShila Portal! Please complete your onboarding checklist.', author: 'Tech Lead', date: '2026-06-01' });
        alert('Firestore seeded successfully! Reloading...');
        window.location.reload();
      } else {
        alert('Firestore is already seeded.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const login = (userId: string) => {
    // fallback to MOCK_USERS if DB is empty
    const availableUsers = users.length > 0 ? users : MOCK_USERS;
    const user = availableUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('adishila_user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adishila_user');
  };

  const completeOnboarding = async () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, onboardingComplete: true };
      setCurrentUser(updatedUser);
      localStorage.setItem('adishila_user', JSON.stringify(updatedUser));
      try { await updateDoc(doc(db, 'users', currentUser.id), { onboardingComplete: true }); } catch(e) { console.error(e); }
    }
  };

  const addNotification = async (type: string, message: string) => {
    const newNotif = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    try { await setDoc(doc(db, 'notifications', newNotif.id), newNotif); } catch(e) { console.error(e); }
  };

  const markNotificationRead = async (id: string) => {
    try { await updateDoc(doc(db, 'notifications', id), { read: true }); } catch(e) { console.error(e); }
  };

  const updateTask = async (task: Task) => {
    try {
      const oldTask = tasks.find(t => t.id === task.id);
      await updateDoc(doc(db, 'tasks', task.id), { ...task });
      
      // GBP Auto-Credit
      if (oldTask && oldTask.status !== 'Completed' && task.status === 'Completed' && task.assigneeId) {
        const assignee = users.find(u => u.id === task.assigneeId);
        if (assignee) {
          await updateDoc(doc(db, 'users', assignee.id), { gbp: assignee.gbp + task.gbp });
          alert(`✓ +${task.gbp} GBP credited to ${assignee.name}`);
        }
        await addNotification('task_completed', `Task "${task.title}" completed by ${assignee?.name || 'User'}`);
      } else if (oldTask && oldTask.status === 'Completed' && task.status !== 'Completed' && task.assigneeId) {
        // Reverse GBP if moved from Completed back to In Progress
        const assignee = users.find(u => u.id === task.assigneeId);
        if (assignee) {
          await updateDoc(doc(db, 'users', assignee.id), { gbp: assignee.gbp - task.gbp });
        }
      }
    } catch(e) { console.error(e); }
  };

  const addLead = async (lead: Lead) => {
    try { 
      await setDoc(doc(db, 'leads', lead.id), lead); 
      await addNotification('lead_added', `New lead ${lead.name} added by ${currentUser?.name || 'User'}`);
    } catch(e) { console.error(e); }
  };

  const updateLead = async (updatedLead: Lead) => {
    try { await updateDoc(doc(db, 'leads', updatedLead.id), { ...updatedLead }); } catch(e) { console.error(e); }
  };

  const assignLead = async (leadId: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      try { await updateDoc(doc(db, 'leads', leadId), { assigneeId: user.id, assigneeName: user.name }); } catch(e) { console.error(e); }
    }
  };

  const addContent = async (item: ContentItem) => {
    const newItem = { ...item, authorId: currentUser?.id };
    try { await setDoc(doc(db, 'content', newItem.id), newItem); } catch(e) { console.error(e); }
  };

  const approveContent = async (itemId: string) => {
    const item = content.find(c => c.id === itemId);
    if (!item || item.status === 'Published') return;

    const sku = skus.find(s => s.name === item.sku);
    const gbpRate = sku ? parseInt(sku.gbpRate) || 0 : 0;
    
    try {
      await updateDoc(doc(db, 'content', itemId), { status: 'Published', gbpEarned: gbpRate });
      await addNotification('content_published', `Content "${item.title}" published`);
      if (item.authorId) {
        const author = users.find(u => u.id === item.authorId);
        if (author) {
          await updateDoc(doc(db, 'users', author.id), { gbp: author.gbp + gbpRate });
        }
      }
    } catch(e) { console.error(e); }
  };

  const addAnnouncement = async (text: string) => {
    if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Chief Administrator')) {
      const newAnn = {
        id: Date.now().toString(),
        text,
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0]
      };
      try { 
        await setDoc(doc(db, 'announcements', newAnn.id), newAnn);
        await addNotification('announcement', `New announcement posted by ${currentUser.name}`);
      } catch(e) { console.error(e); }
    }
  };

  const addSystemAnnouncement = async (text: string) => {
    const newAnn = {
      id: Date.now().toString(),
      text,
      author: 'System',
      date: new Date().toISOString().split('T')[0]
    };
    try { await setDoc(doc(db, 'announcements', newAnn.id), newAnn); } catch(e) { console.error(e); }
  };

  return (
    <AppContext.Provider value={{
      currentUser, loading, login, logout,
      skus,
      tasks, updateTask,
      leads, addLead, updateLead, assignLead,
      content, addContent, approveContent,
      users, completeOnboarding,
      announcements, addAnnouncement, addSystemAnnouncement,
      notifications, markNotificationRead,
      seedFirestore, error
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
