export interface CollaboratorData {
  nombre: string;
  cargo: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  currentScreen: 'collaborator' | 'quiz' | 'result';
  collaborator: CollaboratorData;
  answers: Record<number, number>; // question index -> selected option index
  currentQuestionIndex: number;
  submittedToScript: boolean;
  isSubmitting: boolean;
  submissionSuccessMessage: string | null;
}

export interface PostPayload {
  nombre: string;
  cargo: string;
  nota: string;
  porcentaje: string;
  fecha: string;
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  tableName: string;
}
