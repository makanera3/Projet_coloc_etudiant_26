
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? 'text-violet-700 font-bold bg-violet-50 rounded-full' 
    : 'text-slate-600 hover:text-violet-600 hover:bg-slate-50 rounded-full font-medium';

  return (
    <nav className="glass border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
               <div className="h-8 w-8 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                 C
               </div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-600 tracking-tight">
                ColocEtudiant
              </span>
            </Link>
            <div className="hidden md:flex space-x-2">
              <Link to="/annonces" className={`px-4 py-2 text-sm transition-all ${isActive('/annonces')}`}>
                Annonces
              </Link>
              {isAuthenticated && (
                <Link to="/messages" className={`px-4 py-2 text-sm transition-all ${isActive('/messages')}`}>
                    Messages
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                 <Link to="/creer_annonce">
                   <Button variant="outline" className="hidden md:flex py-2 px-4 text-xs border border-violet-200 bg-violet-50">
                     <span className="mr-1">+</span> Publier
                   </Button>
                </Link>
                <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
                <Link to="/profile" className="flex items-center gap-3 group pl-2 pr-1 py-1 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                  <div className="text-right hidden md:block">
                     <p className="text-sm font-bold text-slate-700 group-hover:text-violet-700">{user?.username}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-violet-700 font-bold border-2 border-white shadow-sm">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <Button variant="ghost" onClick={logout} className="p-2 rounded-full h-10 w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-semibold">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="shadow-violet-500/20">C'est parti !</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};