
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { Annonce } from '../types';
import { Button } from '../components/Button';

export const AnnonceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [annonce, setAnnonce] = useState<Annonce | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');

    // Fix: Updated useEffect to await asynchronous storage call
    useEffect(() => {
        const fetchAnnonce = async () => {
            if (id) {
                const allAnnonces = await storage.getAnnonces();
                const found = allAnnonces.find(a => a.id === Number(id));
                if (found) {
                    setAnnonce(found);
                    if (found.photos && found.photos.length > 0) {
                        setSelectedImage(found.photos[0]);
                    } else {
                        setSelectedImage(`https://picsum.photos/800/600?random=${found.id}`);
                    }
                }
            }
        };
        fetchAnnonce();
    }, [id]);

    if (!annonce) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Annonce introuvable</h2>
                <Link to="/annonces">
                    <Button>Retour aux annonces</Button>
                </Link>
            </div>
        );
    }

    const getDpeColor = (letter: string) => {
        const map: any = { 'A': 'bg-green-500', 'B': 'bg-green-400', 'C': 'bg-lime-400', 'D': 'bg-yellow-400', 'E': 'bg-orange-400', 'F': 'bg-orange-500', 'G': 'bg-red-500' };
        return map[letter] || 'bg-slate-400';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Button variant="ghost" onClick={() => navigate('/annonces')} className="mb-6 pl-0 hover:bg-transparent hover:text-violet-600">
                ← Retour aux annonces
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {annonce.typeBien}
                            </span>
                            {annonce.meuble && (
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Meublé
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">{annonce.titre}</h1>
                        <p className="text-lg text-slate-500 flex items-center">
                            <svg className="w-5 h-5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {annonce.adresse}, {annonce.ville}
                        </p>
                    </div>

                    {/* Gallery */}
                    <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
                        <div className="aspect-video w-full bg-slate-200 relative">
                             <img src={selectedImage} alt={annonce.titre} className="w-full h-full object-cover" />
                             <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-lg text-sm font-bold">
                                 {annonce.photos?.length || 0} photos
                             </div>
                        </div>
                        {annonce.photos && annonce.photos.length > 1 && (
                            <div className="p-4 flex gap-2 overflow-x-auto">
                                {annonce.photos.map((photo, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setSelectedImage(photo)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === photo ? 'border-violet-600 ring-2 ring-violet-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={photo} alt={`Vue ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {annonce.description}
                        </p>
                    </div>

                    {/* Caractéristiques */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Caractéristiques</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Surface</p>
                                    <p className="font-semibold text-slate-900">{annonce.surface} m²</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Pièces</p>
                                    <p className="font-semibold text-slate-900">{annonce.pieces} pièces</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Disponibilité</p>
                                    <p className="font-semibold text-slate-900">{new Date(annonce.dateDisponibilite).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Chauffage</p>
                                    <p className="font-semibold text-slate-900">{annonce.chauffage} ({annonce.sourceEnergie})</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Parking</p>
                                    <p className="font-semibold text-slate-900">{annonce.parking ? 'Oui' : 'Non'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                     {/* Plan */}
                     {annonce.plan && (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Plan du bien</h3>
                            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                                <img src={annonce.plan} alt="Plan" className="w-full h-auto" />
                            </div>
                        </div>
                     )}

                     {/* Performance Énergétique */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Diagnostic de Performance Énergétique</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div>
                                 <p className="text-sm font-bold text-slate-700 mb-3">Consommation (DPE)</p>
                                 <div className="flex items-center gap-4">
                                     <div className={`w-16 h-16 ${getDpeColor(annonce.dpeLettre)} rounded-xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg`}>
                                         {annonce.dpeLettre}
                                     </div>
                                     <div>
                                         <p className="text-2xl font-bold text-slate-900">{annonce.dpeConso} <span className="text-sm font-normal text-slate-500">kWh/m²/an</span></p>
                                         <p className="text-xs text-slate-500">Conso. finale: {annonce.consoFinale} kWh/m²/an</p>
                                     </div>
                                 </div>
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-slate-700 mb-3">Émissions (GES)</p>
                                 <div className="flex items-center gap-4">
                                     <div className={`w-16 h-16 ${getDpeColor(annonce.gesLettre)} rounded-xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg`}>
                                         {annonce.gesLettre}
                                     </div>
                                     <div>
                                         <p className="text-2xl font-bold text-slate-900">{annonce.gesEmission} <span className="text-sm font-normal text-slate-500">kgCO2/m²/an</span></p>
                                     </div>
                                 </div>
                             </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-sm text-slate-600">
                                Estimation des coûts annuels d'énergie : entre <span className="font-bold text-slate-900">{annonce.coutEnergieMin}€</span> et <span className="font-bold text-slate-900">{annonce.coutEnergieMax}€</span> par an.
                                <br/><span className="text-xs text-slate-400">Prix moyens des énergies indexés au {new Date(annonce.dateIndexationEnergie).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Price Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
                        <div className="mb-6">
                             <p className="text-slate-500 font-medium mb-1">Loyer mensuel charges comprises</p>
                             <div className="flex items-baseline gap-2">
                                 <span className="text-4xl font-extrabold text-violet-600">{annonce.loyerBase + annonce.charges} €</span>
                                 <span className="text-slate-400">/ mois</span>
                             </div>
                        </div>

                        <div className="space-y-3 mb-6 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex justify-between">
                                <span>Loyer hors charges</span>
                                <span className="font-bold">{annonce.loyerBase} €</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Charges</span>
                                <span className="font-bold">{annonce.charges} €</span>
                            </div>
                             <div className="border-t border-slate-200 pt-2 flex justify-between">
                                <span>Dépôt de garantie</span>
                                <span className="font-bold">{annonce.depotGarantie} €</span>
                            </div>
                        </div>

                        {annonce.encadrementLoyers && (
                             <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800">
                                 ⚠️ Zone soumise à l'encadrement des loyers.
                                 <br/>Loyer de ref. majoré : <strong>{annonce.loyerReferenceMajore} €</strong>
                             </div>
                        )}

                        <div className="space-y-3">
                             <Link to="/messages" className="block">
                                <Button className="w-full justify-center py-4 text-base shadow-violet-500/20">Contacter le propriétaire</Button>
                             </Link>
                             <Button variant="outline" className="w-full justify-center">Ajouter aux favoris</Button>
                        </div>

                        <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-100">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white font-bold ring-4 ring-white shadow-lg">
                                {annonce.auteur_username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Publié par</p>
                                <p className="font-bold text-slate-900">{annonce.auteur_username}</p>
                                <p className="text-xs text-slate-500">Membre vérifié</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
