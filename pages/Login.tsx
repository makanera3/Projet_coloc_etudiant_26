
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { supabase } from "../supabase";

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Utilisation de la méthode signInWithPassword demandée
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (authError) {
        alert(authError.message);
        throw authError;
      }

      if (authData.user) {
        // On récupère les données complémentaires du profil (rôle, etc.)
        const userProfile = await storage.getUserById(authData.user.id);

        if (userProfile) {
          login(userProfile);
          alert("Connexion réussie !");
          navigate('/');
        } else {
          setError("Profil utilisateur introuvable dans la base de données.");
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "DATABASE_NOT_INITIALIZED") {
        setError("La table 'users' n'existe pas encore. Veuillez d'abord l'initialiser via la page d'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bon retour !</h2>
          <p className="mt-2 text-sm text-slate-500">Heureux de vous revoir sur ColocEtudiant.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs text-center font-bold border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">Email</label>
              <input 
                type="email" 
                required 
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">Mot de passe</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full py-4 shadow-xl shadow-violet-500/20" isLoading={loading}>
            Se connecter
          </Button>
          
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Pas encore de compte ? <Link to="/register" className="text-violet-600 font-bold hover:underline">Créer un compte</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};