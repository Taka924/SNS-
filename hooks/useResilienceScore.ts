
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { INITIAL_RESILIENCE_SCORE, QUIZ_CORRECT_ANSWER_POINTS, QUIZ_INCORRECT_ANSWER_PENALTY } from '../constants';

interface ResilienceContextType {
  score: number;
  updateScore: (points: number) => void;
  handleQuizAnswer: (isCorrect: boolean) => void;
}

const ResilienceContext = createContext<ResilienceContextType | undefined>(undefined);

// Define props interface separately for clarity
interface ResilienceProviderProps {
  children: ReactNode;
}

// Use the explicit props interface and JSX.Element as the return type
export const ResilienceProvider = ({ children }: ResilienceProviderProps): JSX.Element => {
  const [score, setScore] = useState<number>(() => {
    const savedScore = localStorage.getItem('resilienceScore');
    return savedScore ? parseInt(savedScore, 10) : INITIAL_RESILIENCE_SCORE;
  });

  useEffect(() => {
    localStorage.setItem('resilienceScore', score.toString());
  }, [score]);

  const updateScore = useCallback((points: number) => {
    setScore(prevScore => Math.max(0, Math.min(100, prevScore + points))); // Score between 0 and 100
  }, []);
  
  const handleQuizAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      updateScore(QUIZ_CORRECT_ANSWER_POINTS);
    } else {
      updateScore(-QUIZ_INCORRECT_ANSWER_PENALTY);
    }
  }, [updateScore]);

  const contextValue = { score, updateScore, handleQuizAnswer };

  return React.createElement(
    ResilienceContext.Provider,
    { value: contextValue },
    children
  );
};

export const useResilienceScore = (): ResilienceContextType => {
  const context = useContext(ResilienceContext);
  if (context === undefined) {
    throw new Error('useResilienceScoreはResilienceProvider内で使用する必要があります');
  }
  return context;
};
