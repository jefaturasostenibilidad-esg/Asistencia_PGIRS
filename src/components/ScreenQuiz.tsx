import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';
import { Question } from '../types';

interface ScreenQuizProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, number>;
  onSelectOption: (questionIndex: number, optionIndex: number) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
}

export const ScreenQuiz: React.FC<ScreenQuizProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  onSelectOption,
  onNextQuestion,
  onPrevQuestion,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionIndex = answers[currentQuestionIndex];
  const isSelected = selectedOptionIndex !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const totalQuestions = questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Quiz Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 sm:p-8 relative overflow-hidden">
        {/* Progress Bar Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Pregunta {currentQuestionIndex + 1} de {totalQuestions}
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
              {Math.round(progressPercent)}% Completado
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Title */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Seleccione una de las 4 opciones a continuación:
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((optionText, optionIdx) => {
            const isOptionSelected = selectedOptionIndex === optionIdx;

            return (
              <button
                key={optionIdx}
                type="button"
                onClick={() => onSelectOption(currentQuestionIndex, optionIdx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 cursor-pointer group ${
                  isOptionSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-white text-slate-700'
                }`}
              >
                {/* Custom Radio Icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 transition-all ${
                    isOptionSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 group-hover:border-emerald-400 bg-white'
                  }`}
                >
                  {isOptionSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">
                      {String.fromCharCode(65 + optionIdx)}
                    </span>
                  )}
                </div>

                {/* Option Text */}
                <span className={`text-sm sm:text-base font-medium leading-relaxed ${
                  isOptionSelected ? 'text-emerald-950 font-semibold' : 'text-slate-800'
                }`}>
                  {optionText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          {/* Previous Question Button */}
          {currentQuestionIndex > 0 ? (
            <button
              type="button"
              onClick={onPrevQuestion}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {/* Next / Finish Button */}
          <button
            type="button"
            disabled={!isSelected}
            onClick={onNextQuestion}
            className={`px-6 py-3 rounded-xl font-display font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              isSelected
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-700/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{isLastQuestion ? 'Finalizar evaluación' : 'Siguiente pregunta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
