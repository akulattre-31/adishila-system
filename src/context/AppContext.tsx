import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Data Types
export type UserRole = 'Member' | 'Admin' | 'Chief Administrator';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  teamId: string;
  gbp: number;
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
  { id: 'c1', title: '"What is Shungite?" science explainer', platform: 'Instagram', persona: 'Arjun', sku: 'Multiple', scheduledDate: '2026-06-10', status: 'Scheduled', gbpEarned: 0 },
  { id: 'c2', title: 'Family Kavach Pack Diwali offer (Hindi)', platform: 'WhatsApp', persona: 'Priya', sku: 'Kavach Shield — OM', scheduledDate: '2026-10-15', status: 'Scheduled', gbpEarned: 0 },
  { id: 'c3', title: 'Aesthetic unboxing, gold OM close-up', platform: 'Instagram', persona: 'Riya', sku: 'Kavach Shield — OM', scheduledDate: '2026-06-17', status: 'Scheduled', gbpEarned: 0 },
  { id: 'c4', title: 'Kavach OM listing update', platform: 'Amazon.in', persona: 'Arjun', sku: 'Kavach Shield — OM', scheduledDate: '2026-06-05', status: 'Published', gbpEarned: 0 },
  { id: 'c5', title: 'B2B listing update', platform: 'IndiaMART', persona: 'Arjun', sku: 'Multiple', scheduledDate: '2026-06-08', status: 'Scheduled', gbpEarned: 0 },
];

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Demo Member', role: 'Member', teamId: '#4703', gbp: 535 },
  { id: 'u2', name: 'Sales Lead Admin', role: 'Admin', teamId: '#4703', gbp: 800 },
  { id: 'u3', name: 'Chief Administrator', role: 'Chief Administrator', teamId: 'ALL', gbp: 0 },
];

interface AppContextType {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  skus: SKU[];
  tasks: Task[];
  updateTask: (task: Task) => void;
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  content: ContentItem[];
  addContent: (content: ContentItem) => void;
  users: User[];
  announcements: { id: string; text: string; author: string; date: string }[];
  addAnnouncement: (text: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // State for all modules
  const [skus] = useState<SKU[]>(MOCK_SKUS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [content, setContent] = useState<ContentItem[]>(MOCK_CONTENT);
  const [users] = useState<User[]>(MOCK_USERS);
  const [announcements, setAnnouncements] = useState([
    { id: 'a1', text: 'Welcome to the AdiShila Portal! Please complete your onboarding checklist.', author: 'Tech Lead', date: '2026-06-01' }
  ]);

  // Load from local storage on mount (simulating a DB fetch)
  useEffect(() => {
    const savedUser = localStorage.getItem('adishila_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedTasks = localStorage.getItem('adishila_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedLeads = localStorage.getItem('adishila_leads');
    if (savedLeads) setLeads(JSON.parse(savedLeads));

    const savedContent = localStorage.getItem('adishila_content');
    if (savedContent) setContent(JSON.parse(savedContent));
    
    const savedAnnouncements = localStorage.getItem('adishila_announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('adishila_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('adishila_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('adishila_content', JSON.stringify(content));
  }, [content]);
  
  useEffect(() => {
    localStorage.setItem('adishila_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const login = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('adishila_user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adishila_user');
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const addLead = (lead: Lead) => {
    setLeads([...leads, lead]);
  };

  const updateLead = (updatedLead: Lead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const addContent = (item: ContentItem) => {
    setContent([...content, item]);
  };

  const addAnnouncement = (text: string) => {
    if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Chief Administrator')) {
      const newAnn = {
        id: Date.now().toString(),
        text,
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0]
      };
      setAnnouncements([newAnn, ...announcements]);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      skus,
      tasks, updateTask,
      leads, addLead, updateLead,
      content, addContent,
      users,
      announcements, addAnnouncement
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
