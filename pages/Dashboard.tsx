
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { storage } from '../services/storage';
import { Task, Expense } from '../types';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tasks' | 'expenses'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newExpense, setNewExpense] = useState({ title: '', amount: '' });

  useEffect(() => {
    refreshData();
  }, []);

  // Fix: Made refreshData async to await storage calls
  const refreshData = async () => {
    const tasksData = await storage.getTasks();
    const expensesData = await storage.getExpenses();
    setTasks(tasksData);
    setExpenses(expensesData);
  };

  // Fix: Made handleAddTask async to await storage call
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;
    await storage.addTask({
        title: newTask,
        assignedTo: user.username, 
        isDone: false,
        dueDate: new Date().toISOString()
    });
    setNewTask('');
    refreshData();
  };

  // Fix: Made handleToggleTask async to await storage call
  const handleToggleTask = async (id: number) => {
      await storage.toggleTask(id);
      refreshData();
  };

  // Fix: Made handleAddExpense async to await storage call
  const handleAddExpense = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newExpense.title || !newExpense.amount || !user) return;
      await storage.addExpense({
          title: newExpense.title,
          amount: parseFloat(newExpense.amount),
          paidBy: user.username,
          date: new Date().toISOString()
      });
      setNewExpense({ title: '', amount: '' });
      refreshData();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Ma Coloc <span className="text-violet-500">🏠</span></h1>
        <p className="text-slate-500 text-lg">Gérez la vie commune sans prise de tête.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Modern Segmented Control */}
        <div className="p-2 bg-slate-50/50 m-6 mb-0 rounded-2xl flex relative border border-slate-200/60">
           <div className={`absolute top-2 bottom-2 w-[calc(50%-8px)] bg-white rounded-xl shadow-sm border border-slate-100 transition-all duration-300 ease-spring ${activeTab === 'expenses' ? 'translate-x-[calc(100%+16px)]' : 'translate-x-0'}`}></div>
           
           <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-3 text-center text-sm font-bold z-10 transition-colors ${activeTab === 'tasks' ? 'text-violet-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              🧹 Tâches Ménagères
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 py-3 text-center text-sm font-bold z-10 transition-colors ${activeTab === 'expenses' ? 'text-violet-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              💸 Dépenses & Tricount
            </button>
        </div>

        <div className="p-8 flex-1">
          {activeTab === 'tasks' ? (
            <div className="space-y-8 max-w-3xl mx-auto">
                 <form onSubmit={handleAddTask} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Ajouter une tâche (ex: Sortir le verre)"
                        className="flex-1 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white shadow-inner focus:border-violet-500 focus:ring-violet-500 px-6 py-3 transition-colors"
                    />
                    <Button type="submit" className="shadow-violet-500/20 px-8">Ajouter</Button>
                </form>

                <ul className="space-y-3">
                    {tasks.map(task => (
                        <li key={task.id} className={`group p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${task.isDone ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100'}`}>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleToggleTask(task.id)}
                                    className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-colors ${task.isDone ? 'bg-violet-500 border-violet-500 text-white' : 'border-slate-300 hover:border-violet-400'}`}
                                >
                                    {task.isDone && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                </button>
                                <div className={task.isDone ? 'line-through text-slate-400' : 'text-slate-800'}>
                                    <p className="font-bold">{task.title}</p>
                                    <p className="text-xs text-slate-500 font-medium">Assigné à: <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-700">{task.assignedTo}</span></p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${task.isDone ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {task.isDone ? 'Fait !' : 'À faire'}
                            </span>
                        </li>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-12">
                             <div className="text-6xl mb-4">✨</div>
                             <p className="text-slate-500 font-medium">Aucune tâche prévue. Profitez !</p>
                        </div>
                    )}
                </ul>
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
                 <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/30 flex justify-between items-center relative overflow-hidden">
                     <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                     <div className="relative z-10">
                         <h3 className="text-violet-200 font-medium mb-1 uppercase tracking-wider text-sm">Total Dépenses</h3>
                         <span className="text-5xl font-extrabold tracking-tight">
                            {expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)} <span className="text-3xl opacity-80">€</span>
                         </span>
                     </div>
                     <div className="text-right relative z-10">
                         <p className="text-sm font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-lg inline-block">Mois en cours</p>
                     </div>
                 </div>

                 <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <input 
                        type="text" 
                        value={newExpense.title}
                        onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                        placeholder="Titre (ex: Internet)"
                        className="md:col-span-2 rounded-xl border-slate-200 px-4 py-3 focus:ring-violet-500 focus:border-violet-500 bg-white"
                    />
                    <input 
                        type="number" 
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        placeholder="Montant (€)"
                        className="rounded-xl border-slate-200 px-4 py-3 focus:ring-violet-500 focus:border-violet-500 bg-white"
                    />
                    <Button type="submit" variant="primary" className="shadow-none">Ajouter</Button>
                </form>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Titre</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payé par</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {expenses.map(expense => (
                                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                        {expense.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded text-xs font-bold">
                                            {expense.paidBy}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-bold">
                                        {expense.amount.toFixed(2)} €
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
