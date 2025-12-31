
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface UserProfile {
  budget: number;
  isSmoker: boolean;
  hasPets: boolean;
  cleanliness: 'relaxed' | 'standard' | 'maniac';
  socialVibe: 'quiet' | 'party' | 'balanced';
  bio: string;
}

export interface User {
  id: string; // Changé de number à string pour l'UUID Supabase
  username: string;
  role: UserRole;
  password?: string;
  profile?: UserProfile;
}

export interface Annonce {
  id: number;
  titre: string;
  description: string;
  auteur_id: string; // Changé de number à string
  auteur_username?: string;
  date_creation: string;
  typeBien: 'maison' | 'appartement';
  adresse: string;
  ville: string;
  surface: number;
  pieces: number;
  dateDisponibilite: string;
  meuble: boolean;
  parking: boolean;
  chauffage: string;
  sourceEnergie: string;
  dpeConso: number;
  dpeLettre: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  gesEmission: number;
  gesLettre: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  consoFinale: number;
  coutEnergieMin: number;
  coutEnergieMax: number;
  dateIndexationEnergie: string;
  photos: string[];
  plan: string | null;
  loyerBase: number;
  charges: number;
  depotGarantie: number;
  encadrementLoyers: boolean;
  loyerReferenceMajore?: number;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Task {
  id: number;
  title: string;
  assignedTo: string;
  isDone: boolean;
  dueDate: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  paidBy: string;
  date: string;
}
