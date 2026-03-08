/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Plus, 
  LogOut, 
  User, 
  ShieldAlert, 
  FileText, 
  Send, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  X,
  Eye,
  Terminal
} from 'lucide-react';

// --- Types ---
interface User {
  id: number;
  email: string;
  username: string;
  role: 'admin' | 'user';
}

interface Problem {
  id: number;
  title: string;
  description: string;
}

interface Submission {
  id: number;
  problem_id: number;
  user_id: number;
  username: string;
  email: string;
  code: string;
  submitted_at: string;
}

interface Cheater {
  id: number;
  problem_id: number;
  user_id: number;
  username: string;
  email: string;
  reason: string;
  details: string;
  detected_at: string;
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => (
  <nav className="flex items-center justify-between px-8 py-4 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        <Code2 className="text-white" size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Decode</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold -mt-1">by codebit</p>
      </div>
    </div>
    
    {user && (
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
          <User size={14} className="text-zinc-400" />
          <span className="text-sm text-zinc-300 font-medium">{user.username}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${user.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
            {user.role}
          </span>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    )}
  </nav>
);

const AuthPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-4 bg-zinc-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-zinc-500 text-sm mb-8">
          {isLogin ? 'Enter your credentials to access Decode' : 'Join Decode and start solving problems'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="johndoe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98]"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 text-sm hover:text-emerald-400 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ user }: { user: User }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [cheaters, setCheaters] = useState<Cheater[]>([]);
  const [viewMode, setViewMode] = useState<'submissions' | 'cheaters'>('submissions');
  const [viewingCode, setViewingCode] = useState<string | null>(null);
  const [expandedCheaterId, setExpandedCheaterId] = useState<number | null>(null);

  const fetchProblems = async () => {
    const res = await fetch('/api/problems');
    const data = await res.json();
    setProblems(data);
  };

  useEffect(() => { fetchProblems(); }, []);

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: newDesc })
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
    fetchProblems();
  };

  const handleViewProblem = async (problem: Problem) => {
    setSelectedProblem(problem);
    const [subRes, cheatRes] = await Promise.all([
      fetch(`/api/admin/submissions/${problem.id}`),
      fetch(`/api/admin/cheaters/${problem.id}`)
    ]);
    setSubmissions(await subRes.json());
    setCheaters(await cheatRes.json());
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2 italic serif">Admin Panel</h2>
          <p className="text-zinc-500">Manage coding challenges and monitor integrity.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <Plus size={20} />
          New Problem
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((p) => (
          <motion.div 
            key={p.id}
            whileHover={{ y: -5 }}
            onClick={() => handleViewProblem(p)}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <FileText className="text-zinc-400 group-hover:text-emerald-500" size={20} />
              </div>
              <ChevronRight className="text-zinc-600 group-hover:text-emerald-500 transition-colors" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
            <p className="text-zinc-500 text-sm line-clamp-2">{p.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Problem Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Create New Problem</h3>
              <form onSubmit={handleAddProblem} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Problem Title</label>
                  <input 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Reverse a Linked List"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description / Instructions</label>
                  <textarea 
                    required
                    rows={6}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                    placeholder="Describe the problem, constraints, and examples..."
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    Create Problem
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Problem Details Modal */}
      <AnimatePresence>
        {selectedProblem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProblem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="relative w-full max-w-5xl h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedProblem.title}</h3>
                  <p className="text-zinc-500 text-sm">Monitoring submissions and integrity</p>
                </div>
                <button 
                  onClick={() => setSelectedProblem(null)}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r border-zinc-800 p-4 space-y-2">
                  <button 
                    onClick={() => setViewMode('submissions')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'submissions' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
                  >
                    <Send size={18} />
                    Submissions
                  </button>
                  <button 
                    onClick={() => setViewMode('cheaters')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === 'cheaters' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
                  >
                    <ShieldAlert size={18} />
                    Cheater List
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
                  {viewMode === 'submissions' ? (
                    <div className="space-y-4">
                      {submissions.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-zinc-600">
                          <Send size={48} className="mb-4 opacity-20" />
                          <p>No submissions yet.</p>
                        </div>
                      ) : (
                        submissions.map((s) => (
                          <div key={s.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-white font-bold">{s.username}</p>
                              <p className="text-zinc-500 text-xs">{s.email} • {new Date(s.submitted_at).toLocaleString()}</p>
                            </div>
                            <button 
                              onClick={() => setViewingCode(s.code)}
                              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-bold"
                            >
                              <Eye size={16} />
                              View Code
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cheaters.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-zinc-600">
                          <CheckCircle2 size={48} className="mb-4 opacity-20" />
                          <p>No cheating detected. Everyone is clean!</p>
                        </div>
                      ) : (
                        (Object.values(cheaters.reduce((acc: Record<number, { user: { username: string, email: string, id: number }, logs: Cheater[] }>, c) => {
                          if (!acc[c.user_id]) acc[c.user_id] = { user: { username: c.username, email: c.email, id: c.user_id }, logs: [] };
                          acc[c.user_id].logs.push(c);
                          return acc;
                        }, {})) as { user: { username: string, email: string, id: number }, logs: Cheater[] }[]).map((group) => (
                          <div key={group.user.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            <div 
                              onClick={() => setExpandedCheaterId(expandedCheaterId === group.user.id ? null : group.user.id)}
                              className="p-4 flex justify-between items-center cursor-pointer hover:bg-zinc-800 transition-colors"
                            >
                              <div>
                                <p className="text-white font-bold">{group.user.username}</p>
                                <p className="text-zinc-500 text-xs">{group.user.email}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-1 rounded font-bold border border-red-500/20">
                                  {group.logs.length} Occurrences
                                </span>
                                <ChevronRight size={16} className={`text-zinc-600 transition-transform ${expandedCheaterId === group.user.id ? 'rotate-90' : ''}`} />
                              </div>
                            </div>
                            
                            <AnimatePresence>
                              {expandedCheaterId === group.user.id && (
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden border-t border-zinc-800 bg-zinc-950/50"
                                >
                                  <div className="p-4 space-y-3">
                                    {group.logs.map((log) => (
                                      <div key={log.id} className="flex justify-between items-start text-xs border-b border-zinc-800/50 pb-2 last:border-0">
                                        <div className="space-y-1">
                                          <p className="text-zinc-300 font-medium">{log.reason}</p>
                                          {log.details && <p className="text-zinc-500 font-mono">{log.details}</p>}
                                        </div>
                                        <p className="text-zinc-600">{new Date(log.detected_at).toLocaleTimeString()}</p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Code Viewer Modal */}
      <AnimatePresence>
        {viewingCode && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingCode(null)}
              className="absolute inset-0 bg-black/90"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl h-full bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Terminal size={18} className="text-emerald-500" />
                  Source Code
                </h4>
                <button 
                  onClick={() => setViewingCode(null)}
                  className="p-2 text-zinc-500 hover:text-white rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <pre className="flex-1 p-6 overflow-auto font-mono text-sm text-zinc-300 bg-zinc-950">
                {viewingCode}
              </pre>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserDashboard = ({ user }: { user: User }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await fetch('/api/problems');
      const data = await res.json();
      setProblems(data);
    };
    fetchProblems();
  }, []);

  // Anti-cheating logic
  const lastCopyRef = useRef<string>('');
  const leaveTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!activeProblem) return;

    const report = async (reason: string, details?: string) => {
      await fetch('/api/report-cheater', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          problem_id: activeProblem.id, 
          user_id: user.id, 
          reason,
          details
        })
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        leaveTimeRef.current = Date.now();
      } else if (document.visibilityState === 'visible' && leaveTimeRef.current) {
        const returnTime = Date.now();
        const leaveStr = new Date(leaveTimeRef.current).toLocaleTimeString();
        const returnStr = new Date(returnTime).toLocaleTimeString();
        report('Tab Switch', `Left: ${leaveStr} | Returned: ${returnStr}`);
        leaveTimeRef.current = null;
      }
    };

    const handleBlur = () => {
      if (!leaveTimeRef.current) {
        leaveTimeRef.current = Date.now();
      }
    };

    const handleFocus = () => {
      if (leaveTimeRef.current) {
        const returnTime = Date.now();
        const leaveStr = new Date(leaveTimeRef.current).toLocaleTimeString();
        const returnStr = new Date(returnTime).toLocaleTimeString();
        report('Window Focus Lost', `Left: ${leaveStr} | Returned: ${returnStr}`);
        leaveTimeRef.current = null;
      }
    };

    const handleCopy = () => {
      const activeElement = document.activeElement;
      let selection = '';
      
      if (activeElement instanceof HTMLTextAreaElement) {
        selection = activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd);
      } else {
        selection = window.getSelection()?.toString() || '';
      }

      if (selection) {
        lastCopyRef.current = selection;
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('copy', handleCopy);
    };
  }, [activeProblem, user.id]);

  const handleSubmit = async () => {
    if (!activeProblem) return;
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        problem_id: activeProblem.id, 
        user_id: user.id, 
        code 
      })
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveProblem(null);
      setCode('');
    }, 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white tracking-tight mb-2 italic serif">Challenges</h2>
        <p className="text-zinc-500">Solve problems and build your skills. Integrity is monitored.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((p) => (
          <motion.div 
            key={p.id}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => {
              setActiveProblem(p);
              setCode('// Write your code here...\n\n');
            }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Terminal className="text-zinc-400 group-hover:text-emerald-500" size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">Problem #{p.id}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{p.title}</h3>
            <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">{p.description}</p>
            <div className="mt-8 flex items-center gap-2 text-emerald-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Solve Challenge <ChevronRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {activeProblem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-6xl h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Code2 className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeProblem.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Live Session • Anti-Cheat Active</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveProblem(null)}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Problem Description */}
                <div className="w-1/3 border-r border-zinc-800 p-6 overflow-y-auto bg-zinc-900/30">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Problem Statement</h4>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{activeProblem.description}</p>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 flex flex-col bg-zinc-950">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Editor (JavaScript)</span>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    </div>
                  </div>
                  <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData?.getData('text') || '';
                      const normalizedPasted = pastedText.replace(/\r\n/g, '\n').trim();
                      const normalizedLastCopy = lastCopyRef.current.replace(/\r\n/g, '\n').trim();

                      if (normalizedPasted && normalizedPasted !== normalizedLastCopy) {
                        // Report external paste
                        fetch('/api/report-cheater', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            problem_id: activeProblem.id, 
                            user_id: user.id, 
                            reason: 'External Paste Detected',
                            details: `Pasted: "${pastedText.substring(0, 30)}${pastedText.length > 30 ? '...' : ''}"`
                          })
                        });
                      }
                    }}
                    spellCheck={false}
                    className="flex-1 p-6 font-mono text-sm text-emerald-400 bg-transparent resize-none focus:outline-none leading-relaxed"
                  />
                  <div className="p-4 border-t border-zinc-800 flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      disabled={submitted}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${submitted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'}`}
                    >
                      {submitted ? (
                        <>
                          <CheckCircle2 size={20} />
                          Submitted Successfully
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Submit Solution
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('decode_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('decode_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('decode_user');
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar user={user} onLogout={handleLogout} />
      
      {!user ? (
        <AuthPage onLogin={handleLogin} />
      ) : user.role === 'admin' ? (
        <AdminDashboard user={user} />
      ) : (
        <UserDashboard user={user} />
      )}

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Code2 size={20} />
            <span className="text-sm font-bold tracking-tight">Decode</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold">by codebit</span>
          </div>
          <p className="text-xs text-zinc-600 font-medium">
            © {new Date().getFullYear()} Decode Platform. All rights reserved. Built for secure coding assessments.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-zinc-600 hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-zinc-600 hover:text-emerald-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
