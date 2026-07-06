import React from 'react';
import { Leaf, Settings, Factory, Database } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  isSupabaseConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, isSupabaseConfigured }) => {
  return (
    <header className="w-full bg-emerald-900/90 backdrop-blur-md border-b border-emerald-800 text-white shadow-lg sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-950/40 border border-emerald-400/30 shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-emerald-50 leading-none">
                EVECA - Capacitación PGIRS
              </h1>
            </div>
            <p className="text-xs text-emerald-200/80 font-medium flex items-center gap-1.5 mt-1">
              <Factory className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Extractora de Aceite de Palma</span>
              <span className="hidden sm:inline text-emerald-400/50">•</span>
              <span className="hidden sm:inline">Manejo Integral de Residuos</span>
            </p>
          </div>
        </div>

        {/* Right Action: Settings / Supabase Config */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            type="button"
            title="Configuración de Base de Datos Supabase"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer ${
              isSupabaseConfigured 
                ? 'bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/60'
                : 'bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Supabase</span>
            <Settings className="w-3.5 h-3.5 opacity-75" />
            {!isSupabaseConfigured && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Configurar credenciales Supabase" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

