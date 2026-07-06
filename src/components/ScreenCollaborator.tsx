import React, { useState } from 'react';
import { User, Briefcase, ArrowRight, ShieldCheck, FileSpreadsheet, Sparkles, AlertCircle } from 'lucide-react';
import { CollaboratorData } from '../types';

interface ScreenCollaboratorProps {
  initialData: CollaboratorData;
  onStart: (data: CollaboratorData) => void;
}

export const ScreenCollaborator: React.FC<ScreenCollaboratorProps> = ({ initialData, onStart }) => {
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [cargo, setCargo] = useState(initialData.cargo || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNombre = nombre.trim();
    const trimmedCargo = cargo.trim();

    if (!trimmedNombre || !trimmedCargo) {
      setError('Por favor ingrese tanto el nombre completo como el cargo para iniciar.');
      return;
    }

    setError(null);
    onStart({
      nombre: trimmedNombre,
      cargo: trimmedCargo
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 sm:p-8 relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 mb-2">
            PANTALLA 1 • Registro de Participante
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Datos del Colaborador
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Ingrese sus datos personales para dar inicio a la evaluación de Gestión Ambiental (PGIRS).
          </p>
        </div>

        {/* Validation Error */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre Completo */}
          <div>
            <label htmlFor="nombre-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="nombre-input"
                type="text"
                required
                placeholder="Ej. Juan Carlos Pérez López"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Cargo */}
          <div>
            <label htmlFor="cargo-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cargo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <input
                id="cargo-input"
                type="text"
                required
                placeholder="Ej. Operario de Fruto / Técnico PGIRS"
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Information Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Su evaluación consta de <strong>3 preguntas</strong> de opción múltiple. Al finalizar podrá enviar sus resultados.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-bold text-base shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Comenzar evaluación</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};
