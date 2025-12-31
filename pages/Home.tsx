
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] flex flex-col justify-center">
      {/* Hero Section - Centered content without image */}
      <section className="relative overflow-hidden py-12 lg:py-24 px-4">
        {/* Subtle Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-violet-50/50 to-transparent -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 font-bold text-sm mb-8 border border-violet-200 animate-in fade-in slide-in-from-top-4 duration-700">
            🏫 La communauté étudiante
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 tracking-tighter leading-none mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            ColocEtudiant
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Trouvez des colocataires qui vous ressemblent et un logement adapté à votre vie étudiante.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link to="/annonces" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-10 py-5 text-xl shadow-2xl shadow-violet-500/20">
                🔍 Consulter les annonces
              </Button>
            </Link>
            {!isAuthenticated ? (
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto px-10 py-5 text-xl bg-white border-slate-200">
                  S'inscrire
                </Button>
              </Link>
            ) : (
              <Link to="/creer_annonce" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto px-10 py-5 text-xl bg-white border-slate-200">
                  🏠 Publier une offre
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
