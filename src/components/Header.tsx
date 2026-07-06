import React, { useState } from 'react';
import { Leaf, Factory } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 5) {
      setClickCount(0);
      onOpenSettings();
    } else {
      setClickCount(nextCount);
      // Reset counter after 3 seconds of inactivity
      setTimeout(() => setClickCount(0), 3000);
    }
  };

  return (
    <header className="w-full bg-emerald-900/90 backdrop-blur-md border-b border-emerald-800 text-white shadow-lg sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div 
            onClick={handleLogoClick}
            title="EVECA PGIRS"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-950/40 border border-emerald-400/30 shrink-0 cursor-pointer select-none"
          >
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
      </div>
    </header>
  );
};


