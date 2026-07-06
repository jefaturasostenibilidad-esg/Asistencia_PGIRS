import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScreenCollaborator } from './components/ScreenCollaborator';
import { ScreenQuiz } from './components/ScreenQuiz';
import { ScreenResult } from './components/ScreenResult';
import { SettingsModal } from './components/SettingsModal';
import { QUIZ_QUESTIONS } from './data/questions';
import { CollaboratorData, SupabaseSettings } from './types';
import { ShieldCheck } from 'lucide-react';

const LOCAL_STORAGE_WEBHOOK_KEY = 'eveca_pgirs_webhook_url';
const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/1We9YgWoNuS66I1K5vtkSsPJsXj15jF7mU7fYYHx_EI-4szC5v1z5lck6/exec';

const LOCAL_STORAGE_SUPABASE_URL = 'eveca_pgirs_supabase_url';
const LOCAL_STORAGE_SUPABASE_KEY = 'eveca_pgirs_supabase_key';
const LOCAL_STORAGE_SUPABASE_TABLE = 'eveca_pgirs_supabase_table';

export default function App() {
  // Screen state
  const [screen, setScreen] = useState<'collaborator' | 'quiz' | 'result'>('collaborator');

  // Collaborator info
  const [collaborator, setCollaborator] = useState<CollaboratorData>({
    nombre: '',
    cargo: '',
  });

  // Quiz answers map: questionIndex -> selectedOptionIndex
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Webhook configuration
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_WEBHOOK_KEY) || DEFAULT_WEBHOOK_URL;
  });

  // Supabase configuration state
  const [supabaseSettings, setSupabaseSettings] = useState<SupabaseSettings>(() => {
    return {
      url: localStorage.getItem(LOCAL_STORAGE_SUPABASE_URL) || (import.meta.env.VITE_SUPABASE_URL as string) || '',
      anonKey: localStorage.getItem(LOCAL_STORAGE_SUPABASE_KEY) || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '',
      tableName: localStorage.getItem(LOCAL_STORAGE_SUPABASE_TABLE) || 'evaluaciones_pgirs',
    };
  });

  // Settings modal open state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save webhook URL to local storage
  const handleSaveWebhookUrl = (newUrl: string) => {
    const trimmed = newUrl.trim();
    setWebhookUrl(trimmed);
    localStorage.setItem(LOCAL_STORAGE_WEBHOOK_KEY, trimmed);
  };

  // Save Supabase settings
  const handleSaveSupabaseSettings = (newSettings: SupabaseSettings) => {
    setSupabaseSettings(newSettings);
    localStorage.setItem(LOCAL_STORAGE_SUPABASE_URL, newSettings.url);
    localStorage.setItem(LOCAL_STORAGE_SUPABASE_KEY, newSettings.anonKey);
    localStorage.setItem(LOCAL_STORAGE_SUPABASE_TABLE, newSettings.tableName);
  };

  const isSupabaseConfigured = Boolean(
    supabaseSettings.url && 
    supabaseSettings.url.startsWith('http') && 
    supabaseSettings.anonKey
  );

  // Start quiz from Screen 1
  const handleStartQuiz = (data: CollaboratorData) => {
    setCollaborator(data);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScreen('quiz');
  };

  // Select option on Screen 2
  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx,
    }));
  };

  // Next question / Finish quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setScreen('result');
    }
  };

  // Previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Restart quiz for a new collaborator
  const handleRestart = () => {
    setCollaborator({ nombre: '', cargo: '' });
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScreen('collaborator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Step Indicator Badges */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          {/* Step 1 */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            screen === 'collaborator'
              ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/50'
              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-800'
          }`}>
            <span className="w-4 h-4 rounded-full bg-emerald-950/30 flex items-center justify-center text-[10px]">1</span>
            <span>Datos</span>
          </div>

          <div className="w-4 sm:w-8 h-0.5 bg-emerald-800" />

          {/* Step 2 */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            screen === 'quiz'
              ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/50'
              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-800'
          }`}>
            <span className="w-4 h-4 rounded-full bg-emerald-950/30 flex items-center justify-center text-[10px]">2</span>
            <span>Evaluación</span>
          </div>

          <div className="w-4 sm:w-8 h-0.5 bg-emerald-800" />

          {/* Step 3 */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            screen === 'result'
              ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/50'
              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-800'
          }`}>
            <span className="w-4 h-4 rounded-full bg-emerald-950/30 flex items-center justify-center text-[10px]">3</span>
            <span>Resultado</span>
          </div>
        </div>

        {/* Dynamic Screen Components */}
        {screen === 'collaborator' && (
          <ScreenCollaborator
            initialData={collaborator}
            onStart={handleStartQuiz}
          />
        )}

        {screen === 'quiz' && (
          <ScreenQuiz
            questions={QUIZ_QUESTIONS}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
          />
        )}

        {screen === 'result' && (
          <ScreenResult
            collaborator={collaborator}
            questions={QUIZ_QUESTIONS}
            answers={answers}
            webhookUrl={webhookUrl}
            supabaseSettings={supabaseSettings}
            onRestart={handleRestart}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-emerald-950/80 border-t border-emerald-900/60 py-4 px-4 text-center text-xs text-emerald-300/70">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            EVECA - Sistema de Evaluación PGIRS • Extractora de Aceite de Palma
          </p>
          <p className="text-[11px] text-emerald-400/60">
            Res. 2184 de 2019 • CRETIB • Gestión Ambiental
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        supabaseSettings={supabaseSettings}
        webhookUrl={webhookUrl}
        onSaveSupabase={handleSaveSupabaseSettings}
        onSaveWebhookUrl={handleSaveWebhookUrl}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

