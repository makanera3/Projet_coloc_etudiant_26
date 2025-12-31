
import { User, Annonce, Message, Task, Expense } from '../types';
import { supabase } from '../supabase';

const isMissingTableError = (error: any) => {
  return (
    error.message?.includes('schema cache') || 
    error.code === '42P01' || 
    error.code === 'PGRST106' || 
    error.message?.includes('does not exist') ||
    error.message?.includes('not found')
  );
};

const handleStorageError = (error: any) => {
  if (isMissingTableError(error)) {
    console.error("ERREUR CRITIQUE : Base de données non initialisée.");
    throw new Error("DATABASE_NOT_INITIALIZED");
  }
  throw error;
};

export const storage = {
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) handleStorageError(error);
    return data || [];
  },

  getUserById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') handleStorageError(error);
    return data || null;
  },

  addUser: async (userData: User): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) handleStorageError(error);
    return data;
  },

  updateUser: async (updatedUser: User): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .update(updatedUser)
      .eq('id', updatedUser.id);
    if (error) handleStorageError(error);
  },

  getAnnonces: async (): Promise<Annonce[]> => {
    const { data, error } = await supabase
      .from('annonces')
      .select('*')
      .order('date_creation', { ascending: false });
    if (error) handleStorageError(error);
    return data || [];
  },

  addAnnonce: async (annonce: Omit<Annonce, 'id' | 'date_creation'>): Promise<Annonce> => {
    const { data, error } = await supabase
      .from('annonces')
      .insert([{
        ...annonce,
        date_creation: new Date().toISOString()
      }])
      .select()
      .single();
    if (error) handleStorageError(error);
    return data;
  },

  getMessages: async (): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });
    if (error) handleStorageError(error);
    return data || [];
  },

  addMessage: async (msg: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<void> => {
    const { error } = await supabase
      .from('messages')
      .insert([{
        ...msg,
        timestamp: new Date().toISOString(),
        read: false
      }]);
    if (error) handleStorageError(error);
  },

  getTasks: async (): Promise<Task[]> => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) handleStorageError(error);
    return data || [];
  },

  addTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    if (error) handleStorageError(error);
    return data;
  },

  toggleTask: async (id: number): Promise<void> => {
    const { data: task, error: getError } = await supabase.from('tasks').select('isDone').eq('id', id).single();
    if (getError) handleStorageError(getError);
    if (task) {
        const { error: updateError } = await supabase.from('tasks').update({ isDone: !task.isDone }).eq('id', id);
        if (updateError) handleStorageError(updateError);
    }
  },

  getExpenses: async (): Promise<Expense[]> => {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) handleStorageError(error);
    return data || [];
  },

  addExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single();
    if (error) handleStorageError(error);
    return data;
  }
};
