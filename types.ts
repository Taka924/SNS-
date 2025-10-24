
export enum ReliabilityRating {
  HIGHLY_SUSPICIOUS = 'HIGHLY_SUSPICIOUS', // 非常に疑わしい
  POTENTIALLY_MISLEADING = 'POTENTIALLY_MISLEADING', // 誤解を招く可能性
  NEEDS_VERIFICATION = 'NEEDS_VERIFICATION', // 検証が必要
  LIKELY_ACCURATE = 'LIKELY_ACCURATE', // おそらく正確
  UNKNOWN = 'UNKNOWN' // 不明
}

export interface SuggestedSource {
  title: string;
  url: string;
}

export interface AnalysisData {
  reliability: ReliabilityRating;
  explanation: string;
  keywords_for_fact_check: string[];
  suggested_sources?: SuggestedSource[]; // Optional, as Gemini might not always return this
  raw_response?: string; // For debugging
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}
