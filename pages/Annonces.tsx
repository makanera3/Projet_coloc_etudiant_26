
import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { Annonce } from '../types';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const Annonces: React.FC = () => {
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [cityFilter, setCityFilter] = useState('');

  const fetchAnnonces = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storage.getAnnonces();
      setAnnonces(data);
      setFilteredAnnonces(data);
    } catch (err: any) {
      console.error("Failed to fetch ads", err);
      if (err.message === "DATABASE_NOT_INITIALIZED") {
        setError("La base de données n'est pas encore initialisée. Veuillez vérifier vos tables Supabase.");
      } else {
        setError("Une erreur est survenue lors de la récupération des annonces.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  useEffect(() => {
    const filtered = annonces.filter(a => {
        const totalRent = (a.loyerBase || 0) + (a.charges || 0);
        const matchesPrice = totalRent <= maxPrice;
        const matchesCity = cityFilter === '' || (a.ville && a.ville.toLowerCase().includes(cityFilter.toLowerCase()));
        return matchesPrice && matchesCity;
    });
    setFilteredAnnonces(filtered);
  }, [maxPrice, cityFilter, annonces]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Chargement des offres en cours...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-3xl text-red-700 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                    <p className="font-bold text-lg mb-1">Oups ! Un problème est survenu.</p>
                    <p className="text-sm opacity-90">{error}</p>
                </div>
                <Button variant="secondary" onClick={fetchAnnonces} className="bg-white border-red-200 text-red-700 hover:bg-red-50">Réessayer</Button>
            </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-xl">
                    <span className="bg-violet-100 p-2 rounded-lg text-violet-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    </span>
                    Filtres
                </h3>
                
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ville</label>
                    <input 
                        type="text" 
                        placeholder="Paris, Lyon..." 
                        className="w-full border-slate-200 rounded-xl bg-slate-50 focus:ring-violet-500 p-3 text-sm outline-none border transition-colors focus:border-violet-400"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                         <label className="block text-sm font-bold text-slate-700">Budget Max</label>
                         <span className="text-violet-600 font-bold">{maxPrice} €</span>
                    </div>
                    <input 
                        type="range" 
                        min="300" 
                        max="3000" 
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                </div>
            </div>
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explorer les offres</h2>
                    <p className="text-slate-500 mt-1 font-medium">{filteredAnnonces.length} logement{filteredAnnonces.length > 1 ? 's' : ''} trouvé{filteredAnnonces.length > 1 ? 's' : ''}</p>
                </div>
                <Link to="/creer_annonce">
                    <Button variant="primary" className="shadow-violet-500/20">Publier une annonce</Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {filteredAnnonces.map((annonce) => (
                    <div key={annonce.id} className="group bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6">
                        <div className="h-52 md:w-72 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                             <img 
                                src={(annonce.photos && annonce.photos.length > 0) ? annonce.photos[0] : `https://picsum.photos/400/300?random=${annonce.id}`} 
                                alt={annonce.titre} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                             />
                             <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-lg shadow-sm">
                                <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">{annonce.typeBien}</span>
                             </div>
                        </div>
                        <div className="flex-1 flex flex-col py-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{annonce.titre}</h3>
                                <span className={`px-2 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-600 uppercase`}>DPE {annonce.dpeLettre}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                {annonce.ville} • {annonce.surface} m² • {annonce.pieces} pièce{annonce.pieces > 1 ? 's' : ''}
                            </p>
                            <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{annonce.description}</p>
                            <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                                <div>
                                    <span className="text-2xl font-black text-violet-600">{annonce.loyerBase + (annonce.charges || 0)} €</span>
                                    <span className="text-xs text-slate-400 font-bold ml-1">/MOIS CC</span>
                                </div>
                                <Link to={`/annonces/${annonce.id}`}>
                                    <Button variant="secondary" className="text-xs py-2">Consulter les détails</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredAnnonces.length === 0 && !loading && !error && (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="text-6xl mb-6">🏜️</div>
                        <h3 className="text-xl font-bold text-slate-900">Aucune annonce ne correspond</h3>
                        <p className="text-slate-500 mt-2">Essayez de modifier vos filtres pour voir plus d'offres.</p>
                        <Button variant="ghost" onClick={() => {setMaxPrice(2000); setCityFilter('');}} className="mt-4 text-violet-600">Réinitialiser les filtres</Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
