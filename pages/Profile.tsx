import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { UserProfile } from '../types';

export const Profile: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    budget: 0,
    isSmoker: false,
    hasPets: false,
    cleanliness: 'standard',
    socialVibe: 'balanced',
    bio: ''
  });

  useEffect(() => {
    if (user && user.profile) {
      setProfile(user.profile);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = { ...user, profile: profile };
      await storage.updateUser(updatedUser);
      login(updatedUser);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden border border-slate-100 relative">
        <div className="h-48 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-end -mt-12 mb-8 gap-4">
                 <div className="flex items-end gap-6">
                    <div className="p-1.5 bg-white rounded-[2rem] shadow-lg">
                        <div className="h-32 w-32 rounded-[1.7rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl font-extrabold text-slate-400 border-4 border-slate-50 overflow-hidden">
                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-violet-600 to-indigo-600">
                                {user.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="mb-2">
                         <h1 className="text-3xl font-extrabold text-slate-900">{user.username}</h1>
                         <div className="flex gap-2 mt-1">
                             <span className="px-3 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                 {user.role === 'admin' ? 'Propriétaire' : 'Locataire'}
                             </span>
                         </div>
                    </div>
                 </div>
                 {!isEditing && (
                     <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-xl mb-2">Modifier mon profil</Button>
                        <Button variant="ghost" onClick={handleLogout} className="rounded-xl mb-2 text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent">Déconnecter</Button>
                     </div>
                 )}
            </div>
            
            {isEditing ? (
                <form onSubmit={handleSubmit} className="mt-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Édition du profil</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Ambiance Sociale</label>
                             <select
                                value={profile.socialVibe}
                                onChange={(e) => handleInputChange('socialVibe', e.target.value)}
                                className="block w-full border-slate-200 rounded-xl px-4 py-3 focus:ring-violet-500 focus:border-violet-500 bg-white"
                             >
                                 <option value="quiet">🧘 Calme / Studieux</option>
                                 <option value="balanced">⚖️ Équilibré</option>
                                 <option value="party">🎉 Festif</option>
                             </select>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Niveau de propreté</label>
                             <select
                                value={profile.cleanliness}
                                onChange={(e) => handleInputChange('cleanliness', e.target.value)}
                                className="block w-full border-slate-200 rounded-xl px-4 py-3 focus:ring-violet-500 focus:border-violet-500 bg-white"
                             >
                                 <option value="relaxed">😎 Détendu</option>
                                 <option value="standard">🧼 Standard</option>
                                 <option value="maniac">✨ Maniaque</option>
                             </select>
                        </div>
                        <div className="flex flex-col justify-center space-y-3 p-4 bg-white rounded-xl border border-slate-200">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={profile.isSmoker}
                                    onChange={(e) => handleInputChange('isSmoker', e.target.checked)}
                                    className="h-5 w-5 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                                />
                                <span className="font-medium text-slate-700">Fumeur</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={profile.hasPets}
                                    onChange={(e) => handleInputChange('hasPets', e.target.checked)}
                                    className="h-5 w-5 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                                />
                                <span className="font-medium text-slate-700">Animaux de compagnie</span>
                            </label>
                        </div>
                    </div>
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Bio & Recherche</label>
                        <textarea 
                            rows={4}
                            value={profile.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="block w-full border-slate-200 rounded-xl px-4 py-3 focus:ring-violet-500 focus:border-violet-500 bg-white"
                            placeholder="Parlez de vous, de ce que vous aimez..."
                        />
                    </div>
                    <div className="flex justify-end space-x-3 border-t border-slate-200 pt-6">
                        <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>Annuler</Button>
                        <Button type="submit">Enregistrer les modifications</Button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-6">
                         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">👋</span> À propos
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {profile.bio || "Aucune description renseignée pour le moment."}
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-teal-100 p-1.5 rounded-lg text-teal-600">📋</span> Critères
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ambiance</p>
                                    <p className="text-lg font-bold text-slate-900 capitalize">{profile.socialVibe}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Propreté</p>
                                    <p className="text-lg font-bold text-slate-900 capitalize">{profile.cleanliness}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Habitudes</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${profile.isSmoker ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {profile.isSmoker ? 'Fumeur' : 'Non-Fumeur'}
                                        </span>
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${profile.hasPets ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {profile.hasPets ? 'Animaux' : 'Pas d\'animaux'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};