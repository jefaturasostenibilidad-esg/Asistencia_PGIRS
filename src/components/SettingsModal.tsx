import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Copy, 
  Check, 
  FileCode, 
  Link as LinkIcon, 
  Database, 
  Table, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Layers,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { SupabaseSettings } from '../types';
import { SUPABASE_SQL_SCRIPT, fetchEvaluacionesSupabase } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  supabaseSettings: SupabaseSettings;
  webhookUrl: string;
  onSaveSupabase: (settings: SupabaseSettings) => void;
  onSaveWebhookUrl: (url: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  supabaseSettings,
  webhookUrl,
  onSaveSupabase,
  onSaveWebhookUrl,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'supabase' | 'records' | 'appsScript'>('supabase');

  // Supabase state
  const [supaUrl, setSupaUrl] = useState(supabaseSettings.url);
  const [supaKey, setSupaKey] = useState(supabaseSettings.anonKey);
  const [supaTable, setSupaTable] = useState(supabaseSettings.tableName || 'evaluaciones_pgirs');

  // Apps script state
  const [appsScriptUrl, setAppsScriptUrl] = useState(webhookUrl);

  // Copy feedback state
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live records state
  const [records, setRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync state when props change
  useEffect(() => {
    setSupaUrl(supabaseSettings.url);
    setSupaKey(supabaseSettings.anonKey);
    setSupaTable(supabaseSettings.tableName || 'evaluaciones_pgirs');
    setAppsScriptUrl(webhookUrl);
  }, [supabaseSettings, webhookUrl]);

  // Load live records when switching to records tab
  useEffect(() => {
    if (activeTab === 'records' && isOpen) {
      loadLiveRecords();
    }
  }, [activeTab, isOpen]);

  const loadLiveRecords = async () => {
    setIsLoadingRecords(true);
    setRecordsError(null);
    const result = await fetchEvaluacionesSupabase({
      url: supaUrl,
      anonKey: supaKey,
      tableName: supaTable
    });

    if (result.success && result.data) {
      setRecords(result.data);
    } else {
      setRecordsError(result.message || 'No se pudieron consultar los registros de Supabase.');
      setRecords([]);
    }
    setIsLoadingRecords(false);
  };

  if (!isOpen) return null;

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSupabase({
      url: supaUrl.trim(),
      anonKey: supaKey.trim(),
      tableName: supaTable.trim() || 'evaluaciones_pgirs'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveAppsScript = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWebhookUrl(appsScriptUrl.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Filtered records
  const filteredRecords = records.filter(r => 
    (r.nombre && r.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.cargo && r.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center text-emerald-300 border border-emerald-500/30">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-white">
                Base de Datos y Almacenamiento
              </h3>
              <p className="text-xs text-emerald-200/80">
                Gestione la conexión con Supabase o consulte los registros de evaluación en vivo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`px-3.5 py-2.5 rounded-t-xl font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'bg-white text-emerald-800 border-t-2 border-x border-slate-200 border-t-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Configuración Supabase</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('records')}
            className={`px-3.5 py-2.5 rounded-t-xl font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'records'
                ? 'bg-white text-emerald-800 border-t-2 border-x border-slate-200 border-t-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ver Registros en Vivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appsScript')}
            className={`px-3.5 py-2.5 rounded-t-xl font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'appsScript'
                ? 'bg-white text-emerald-800 border-t-2 border-x border-slate-200 border-t-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Google Apps Script</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Configuración guardada exitosamente.</span>
            </div>
          )}

          {/* TAB 1: SUPABASE CONFIGURATION */}
          {activeTab === 'supabase' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>¿Cómo encontrar los datos en Supabase?</span>
                </div>
                <p className="leading-relaxed text-emerald-900/90">
                  1. Ingrese a su proyecto en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-bold text-emerald-800">Supabase.com</a>.<br />
                  2. En el menú lateral haga clic en <strong>Table Editor</strong>.<br />
                  3. Seleccione la tabla <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-emerald-950">evaluaciones_pgirs</code> para ver todas las respuestas recibidas en tiempo real.
                </p>
              </div>

              <form onSubmit={handleSaveSupabase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL del Proyecto Supabase:
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://su-proyecto.supabase.co"
                    value={supaUrl}
                    onChange={(e) => setSupaUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Supabase Anon / Public Key:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="eyJhbGciOiJIUzI1NiI..."
                    value={supaKey}
                    onChange={(e) => setSupaKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre de la Tabla:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="evaluaciones_pgirs"
                    value={supaTable}
                    onChange={(e) => setSupaTable(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Credenciales Supabase</span>
                </button>
              </form>

              {/* SQL Script Generator Box */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-emerald-600" />
                    Script de Creación de Tabla (SQL Editor)
                  </h4>
                  <button
                    type="button"
                    onClick={copySqlToClipboard}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
                  </button>
                </div>

                <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {SUPABASE_SQL_SCRIPT}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE RECORDS VIEWER */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={loadLiveRecords}
                  disabled={isLoadingRecords}
                  className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecords ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>

              {recordsError ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <p className="font-bold">Nota de conexión Supabase:</p>
                  <p className="text-amber-800/90 leading-relaxed">{recordsError}</p>
                  <p className="text-[11px] text-amber-700">
                    Asegúrese de guardar su URL, Anon Key y haber creado la tabla <code className="bg-amber-100 px-1 rounded font-mono">evaluaciones_pgirs</code> en Supabase.
                  </p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 space-y-2">
                  <Table className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No se encontraron registros aún en la tabla de Supabase.</p>
                  <p className="text-[11px] text-slate-400">Complete una evaluación para ver las respuestas registradas en vivo aquí.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Colaborador</th>
                        <th className="p-2.5">Cargo</th>
                        <th className="p-2.5 text-center">Nota</th>
                        <th className="p-2.5 text-center">Porcentaje</th>
                        <th className="p-2.5 text-right">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredRecords.map((rec, i) => (
                        <tr key={rec.id || i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2.5 font-bold text-slate-900">{rec.nombre}</td>
                          <td className="p-2.5 text-slate-600">{rec.cargo}</td>
                          <td className="p-2.5 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                              {rec.nota}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-bold text-emerald-700">{rec.porcentaje}</td>
                          <td className="p-2.5 text-right text-slate-500 text-[11px]">{rec.fecha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: APPS SCRIPT WEBHOOK */}
          {activeTab === 'appsScript' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveAppsScript} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    URL de Google Apps Script Web App:
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono text-xs text-slate-900 bg-slate-50 focus:bg-white transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar URL Apps Script</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
