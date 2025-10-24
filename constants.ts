
import { ReliabilityRating } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export const RELIABILITY_RATING_CONFIG: Record<ReliabilityRating, { text: string; color: string; icon?: string }> = {
  [ReliabilityRating.HIGHLY_SUSPICIOUS]: { text: '非常に疑わしい', color: 'text-red-400 border-red-400 bg-red-900/30', icon: 'ShieldExclamationIcon' },
  [ReliabilityRating.POTENTIALLY_MISLEADING]: { text: '誤解を招く可能性', color: 'text-yellow-400 border-yellow-400 bg-yellow-900/30', icon: 'ExclamationTriangleIcon' },
  [ReliabilityRating.NEEDS_VERIFICATION]: { text: '検証が必要', color: 'text-blue-400 border-blue-400 bg-blue-900/30', icon: 'QuestionMarkCircleIcon' },
  [ReliabilityRating.LIKELY_ACCURATE]: { text: '比較的正確', color: 'text-green-400 border-green-400 bg-green-900/30', icon: 'CheckCircleIcon' },
  [ReliabilityRating.UNKNOWN]: { text: '判定不能', color: 'text-gray-400 border-gray-400 bg-gray-700/30', icon: 'QuestionMarkCircleIcon' },
};

export const MAX_TEXT_LENGTH = 5000; // Example character limit for input

export const INITIAL_RESILIENCE_SCORE = 50;
export const QUIZ_CORRECT_ANSWER_POINTS = 10;
export const QUIZ_INCORRECT_ANSWER_PENALTY = 5;
