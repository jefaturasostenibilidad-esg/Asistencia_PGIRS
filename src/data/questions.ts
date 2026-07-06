import { Question } from '../types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Según el código de colores establecido en la Resolución 2184 de 2019, ¿qué color de recipiente corresponde a los residuos orgánicos aprovechables?",
    options: [
      "a) Roja",
      "b) Negra",
      "c) Blanca",
      "d) Verde"
    ],
    correctIndex: 3, // Verde
    explanation: "La Resolución 2184 de 2019 establece el recipiente VERDE para residuos orgánicos aprovechables (restos de comida, desechos agrícolas/vegetales)."
  },
  {
    id: 2,
    question: "¿Cuál es el prefijo para entender la tipología de los residuos peligrosos?",
    options: [
      "a) SGA",
      "b) CRETIB",
      "c) ISCC",
      "d) Ninguna de las anteriores"
    ],
    correctIndex: 1, // CRETIB
    explanation: "CRETIB es la sigla para la clasificación de residuos peligrosos: Corrosivo, Reactivo, Explosivo, Tóxico, Inflamable y Biológico-Infeccioso."
  },
  {
    id: 3,
    question: "¿Qué lleva al éxito el adecuado manejo integral de residuos?",
    options: [
      "a) Evitar la separación en la fuente",
      "b) Nuestra cultura y sentido de pertenencia",
      "c) Promover el desorden",
      "d) Ninguna de las anteriores"
    ],
    correctIndex: 1, // Nuestra cultura y sentido de pertenencia
    explanation: "La cultura ambiental y la separación responsable en la fuente son los pilares clave del Plan de Gestión Integral de Residuos Sólidos (PGIRS)."
  }
];
