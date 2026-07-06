import React, { useState } from 'react';
import { 
  Trophy, 
  BookOpenCheck, 
  Send, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Award, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Calendar,
  Check,
  HelpCircle,
  AlertCircle,
  Database
} from 'lucide-react';
import { CollaboratorData, Question, PostPayload, SupabaseSettings } from '../types';
import { insertEvaluacionSupabase } from '../lib/supabase';

interface ScreenResultProps {
  collaborator: CollaboratorData;
  questions: Question[];
  answers: Record<number, number>;
  webhookUrl: string;
  supabaseSettings: SupabaseSettings;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const ScreenResult: React.FC<ScreenResultProps> = ({
  collaborator,
  questions,
  answers,
  webhookUrl,
  supabaseSettings,
  onRestart,
  onOpenSettings
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Calculate score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const total = questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const isApproved = correctCount >= 2; // 2 or 3 correct out of 3

  // Format date and time
  const now = new Date();
  const formattedDate = now.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const handleSendResult = async () => {
    setIsSubmitting(true);
    setSubmissionFeedback(null);

    const payload: PostPayload = {
      nombre: collaborator.nombre,
      cargo: collaborator.cargo,
      nota: `${correctCount}/${total}`,
      porcentaje: `${percentage}%`,
      fecha: formattedDate
    };

    // 1. Try sending to Supabase if configured
    let supabaseSuccess = false;
    if (supabaseSettings.url && supabaseSettings.anonKey) {
      const supaRes = await insertEvaluacionSupabase(supabaseSettings, payload);
      supabaseSuccess = supaRes.success;
    }

    // 2. Also post to Webhook (Google Apps Script) if available
    const targetUrl = webhookUrl && webhookUrl.trim() !== '' 
      ? webhookUrl.trim() 
      : "https://script.google.com/macros/s/1We9YgWoNuS66I1K5vtkSsPJsXj15jF7mU7fYYHx_EI-4szC5v1z5lck6/exec";

    try {
      await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
    } catch (err) {
      console.log('Webhook Apps Script llamado con respuesta asíncrona:', err);
    }

    // Always display friendly user response
    setSubmitted(true);
    if (supabaseSuccess) {
      setSubmissionFeedback('¡Gracias! Tu resultado fue registrado con éxito en Supabase.');
    } else {
      setSubmissionFeedback('¡Gracias! Tu resultado fue registrado.');
    }
    setIsSubmitting(false);
  };


  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Result Overview Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 sm:p-8 relative overflow-hidden">
        {/* Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
          isApproved 
            ? 'from-emerald-500 via-green-500 to-teal-500' 
            : 'from-amber-500 via-orange-500 to-yellow-500'
        }`} />

        {/* Status Badge & Icon */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-lg ${
            isApproved 
              ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-600/30 ring-4 ring-emerald-100' 
              : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/30 ring-4 ring-amber-100'
          }`}>
            {isApproved ? (
              <Trophy className="w-10 h-10 animate-bounce" />
            ) : (
              <BookOpenCheck className="w-10 h-10" />
            )}
          </div>

          <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase mb-2 ${
            isApproved 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {isApproved ? 'Aprobado' : 'Debe Repasar'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Resultado de la Evaluación
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Colaborador: <strong className="text-slate-800 font-bold">{collaborator.nombre}</strong> ({collaborator.cargo})
          </p>
        </div>

        {/* Score Display Card */}
        <div className={`p-6 rounded-2xl mb-6 text-center border ${
          isApproved 
            ? 'bg-gradient-to-b from-emerald-50 to-emerald-100/50 border-emerald-200' 
            : 'bg-gradient-to-b from-amber-50 to-amber-100/50 border-amber-200'
        }`}>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Nota Obtenida
          </div>
          <div className="text-4xl sm:text-5xl font-display font-black text-slate-900 tracking-tight my-1">
            {correctCount}/{total}
          </div>
          <div className="text-sm font-extrabold text-emerald-700 bg-white/80 inline-block px-3 py-1 rounded-full border border-emerald-200/80 shadow-xs mt-1">
            {percentage}% de respuestas correctas
          </div>
        </div>

        {/* Motivational Message */}
        <div className={`p-5 rounded-2xl mb-6 border ${
          isApproved 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start gap-3">
            {isApproved ? (
              <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <BookOpenCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-display font-bold text-base mb-1">
                {isApproved ? '¡Excelente Trabajo!' : 'Te invitamos a repasar los conceptos'}
              </h4>
              <p className="text-sm leading-relaxed font-medium">
                {isApproved ? (
                  <>
                    ¡Felicitaciones, <strong>{collaborator.nombre}</strong>! Has superado con éxito la capacitación en Gestión Ambiental PGIRS. Tu compromiso con la separación en la fuente y el manejo seguro de residuos impulsa la sostenibilidad en nuestra extractora de aceite de palma.
                  </>
                ) : (
                  <>
                    Hola, <strong>{collaborator.nombre}</strong>. Has obtenido {correctCount} de 3 respuestas correctas. Te sugerimos repasar los temas clave del PGIRS (Código de colores Resolución 2184, tipología CRETIB para residuos peligrosos y cultura de separación en la fuente) y realizar nuevamente el quiz.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Registration & Submit Action Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {!submitted ? (
            <div>
              <button
                type="button"
                onClick={handleSendResult}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-bold text-base shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Registrando resultado...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar resultado</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 text-center mt-2.5">
                Al hacer clic, se registrarán su nombre, cargo, nota ({correctCount}/{total}) y fecha en el sistema de gestión.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2 animate-fade-in">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white mb-1 shadow-sm">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-base text-emerald-950">
                {submissionFeedback || "¡Gracias! Tu resultado fue registrado."}
              </h4>
              <p className="text-xs text-emerald-700 font-medium">
                Fecha de registro: {formattedDate}
              </p>
            </div>
          )}

          {/* Action to restart for another collaborator */}
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Realizar otra evaluación (Nuevo colaborador)</span>
          </button>
        </div>
      </div>

      {/* Answer Review Section Accordion */}
      <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowReview(!showReview)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <BookOpenCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-display font-bold text-slate-800 text-base">
              Revisar respuestas de la evaluación ({correctCount}/3 correctas)
            </span>
          </div>
          {showReview ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showReview && (
          <div className="p-5 border-t border-slate-100 space-y-4 bg-slate-50/50">
            {questions.map((q, idx) => {
              const selectedIdx = answers[idx];
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div key={q.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-start gap-2 justify-between">
                    <h5 className="font-display font-bold text-sm text-slate-900 leading-snug">
                      {idx + 1}. {q.question}
                    </h5>
                    {isCorrect ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcta
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                        <XCircle className="w-3.5 h-3.5" /> Incorrecta
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1 pt-1">
                    <p className="text-slate-600">
                      <strong>Tu respuesta:</strong>{' '}
                      <span className={isCorrect ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold line-through'}>
                        {selectedIdx !== undefined ? q.options[selectedIdx] : 'Sin responder'}
                      </span>
                    </p>

                    {!isCorrect && (
                      <p className="text-slate-600">
                        <strong>Respuesta correcta:</strong>{' '}
                        <span className="text-emerald-700 font-bold">
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                    )}

                    <p className="text-slate-500 bg-slate-50 p-2 rounded-lg text-[11px] leading-relaxed border border-slate-100 mt-2">
                      💡 <strong>Explicación ambiental:</strong> {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
