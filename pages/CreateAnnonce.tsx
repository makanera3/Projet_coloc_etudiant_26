
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { generateAdDescription } from '../services/geminiService';
import { Annonce } from '../types';

export const CreateAnnonce: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Annonce>>({
    titre: '',
    description: '',
    typeBien: 'appartement',
    adresse: '',
    ville: '',
    surface: 0,
    pieces: 1,
    dateDisponibilite: new Date().toISOString().split('T')[0],
    meuble: false,
    parking: false,
    chauffage: 'Individuel',
    sourceEnergie: 'Électrique',
    dpeConso: 0,
    dpeLettre: 'D',
    gesEmission: 0,
    gesLettre: 'D',
    consoFinale: 0,
    coutEnergieMin: 0,
    coutEnergieMax: 0,
    dateIndexationEnergie: new Date().toISOString().split('T')[0],
    loyerBase: 0,
    charges: 0,
    depotGarantie: 0,
    encadrementLoyers: false,
    loyerReferenceMajore: 0,
    photos: [],
    plan: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue: any = value;

    if (type === 'checkbox') {
        finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
        finalValue = parseFloat(value);
    } else if (value === 'true') {
        finalValue = true;
    } else if (value === 'false') {
        finalValue = false;
    }

    setFormData(prev => ({
        ...prev,
        [name]: finalValue
    }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const files = Array.from(e.target.files) as File[];
          const base64Promises = files.map(file => convertToBase64(file));
          try {
              const base64Images = await Promise.all(base64Promises);
              setFormData(prev => ({
                  ...prev,
                  photos: [...(prev.photos || []), ...base64Images]
              }));
          } catch (err) {
              console.error("Erreur conversion image", err);
              setError("Erreur lors du chargement des images.");
          }
      }
  };

  const removePhoto = (index: number) => {
      setFormData(prev => ({
          ...prev,
          photos: prev.photos?.filter((_, i) => i !== index)
      }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.titre || !formData.ville || !formData.loyerBase) {
        setError("Veuillez remplir au moins le titre, la ville et le loyer pour générer.");
        return;
    }
    setError(null);
    setIsGenerating(true);
    try {
        const generated = await generateAdDescription(formData);
        setFormData(prev => ({ ...prev, description: generated }));
    } catch (err) {
        setError("Erreur lors de la génération IA.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.titre || !formData.description || !user) {
        setError("Titre et description requis.");
        return;
    }

    setIsSubmitting(true);
    try {
        await storage.addAnnonce({
            ...(formData as Omit<Annonce, 'id' | 'date_creation'>),
            auteur_id: user.id,
            auteur_username: user.username
        });
        alert("Annonce publiée avec succès !");
        navigate('/annonces');
    } catch (err: any) {
        console.error("Erreur publication:", err);
        setError("Impossible de publier l'annonce. Vérifiez l'initialisation de votre base Supabase.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-100 flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Publier une annonce</h1>
                <p className="mt-1 text-slate-500 text-sm">Remplissez les détails obligatoires pour être conforme ALUR.</p>
             </div>
             <div className="h-10 w-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
             </div>
         </div>

         <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">{error}</div>}

            {/* Caractéristiques */}
            <section>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
                    Caractéristiques du Bien
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                         <label className="block text-sm font-bold text-slate-700 mb-2">Titre de l'annonce</label>
                         <input type="text" name="titre" value={formData.titre} onChange={handleChange} className="w-full rounded-xl border-slate-200 py-3 px-4 focus:ring-violet-500 focus:border-violet-500 bg-slate-50" placeholder="Ex: Charmant T2 au coeur de Paris" required />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Type de bien</label>
                        <select name="typeBien" value={formData.typeBien} onChange={handleChange} className="w-full rounded-xl border-slate-200 py-3 px-4 bg-slate-50">
                            <option value="appartement">Appartement</option>
                            <option value="maison">Maison</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ville</label>
                        <input type="text" name="ville" value={formData.ville} onChange={handleChange} className="w-full rounded-xl border-slate-200 py-3 px-4 bg-slate-50" placeholder="Paris" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Surface (m²)</label>
                             <input type="number" min="1" name="surface" value={formData.surface} onChange={handleChange} className="w-full rounded-xl border-slate-200 py-3 px-4 bg-slate-50" required />
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Pièces</label>
                             <input type="number" min="1" name="pieces" value={formData.pieces} onChange={handleChange} className="w-full rounded-xl border-slate-200 py-3 px-4 bg-slate-50" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Loyer de base (HC)</label>
                        <div className="relative">
                           <input type="number" min="0" name="loyerBase" value={formData.loyerBase} onChange={handleChange} className="w-full rounded-xl border-slate-200 pl-4 pr-8 py-3 bg-slate-50" required />
                           <span className="absolute right-4 top-3 text-slate-400">€</span>
                        </div>
                    </div>
                </div>
            </section>

             <hr className="border-slate-100" />

             {/* Photos */}
             <section>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-sm">2</span>
                    Photos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Photos du bien</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:bg-slate-50 hover:border-violet-300 transition-colors cursor-pointer relative">
                             <input 
                                type="file" 
                                multiple 
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                             <div className="space-y-1 text-center pointer-events-none">
                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-slate-600 justify-center">
                                    <span className="relative font-bold text-violet-600 rounded-md focus-within:outline-none">
                                        Télécharger des photos
                                    </span>
                                </div>
                             </div>
                        </div>

                        {formData.photos && formData.photos.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {formData.photos.map((photo, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                                        <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={() => removePhoto(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
             </section>

             <hr className="border-slate-100" />

             {/* Description & IA */}
             <section>
                 <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-bold text-indigo-900">Description détaillée</label>
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGenerating}
                            className="text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                        >
                            {isGenerating ? 'Rédaction...' : '✨ Générer avec l\'IA'}
                        </button>
                    </div>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows={6} 
                        className="w-full rounded-xl border-indigo-200 p-4 text-sm bg-white" 
                        placeholder="Parlez-nous du logement..."
                        required
                    ></textarea>
                 </div>
             </section>

             <div className="flex justify-end gap-4">
                 <Button variant="ghost" type="button" onClick={() => navigate('/annonces')}>Annuler</Button>
                 <Button type="submit" className="px-8" isLoading={isSubmitting}>Publier l'annonce</Button>
             </div>
         </form>
      </div>
    </div>
  );
};
