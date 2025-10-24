
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { useResilienceScore } from '../hooks/useResilienceScore';
import { generateQuizQuestions } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { AcademicCapIcon, CheckCircleIcon, XCircleIcon, LightBulbIcon } from '@heroicons/react/24/solid';

const QuizComponent: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleQuizAnswer } = useResilienceScore();

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const quizDataString = await generateQuizQuestions();
        let parsedData;
        try {
            // Attempt to parse, remove potential markdown fences if needed
            let jsonStr = quizDataString.trim();
            const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
            const match = jsonStr.match(fenceRegex);
            if (match && match[2]) {
              jsonStr = match[2].trim();
            }
            parsedData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("クイズデータのJSONパースエラー:", parseError, "Raw data:", quizDataString);
            throw new Error("受信したクイズデータの形式が正しくありません。");
        }

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setQuestions(parsedData);
        } else {
          throw new Error("クイズデータが空か、形式が正しくありません。");
        }
      } catch (e) {
        console.error("クイズ取得エラー:", e);
        setError(e instanceof Error ? e.message : "クイズの読み込みに失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionSelect = (optionText: string) => {
    if (showFeedback) return;
    setSelectedOption(optionText);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    const currentQuestion = questions[currentQuestionIndex];
    const chosenOption = currentQuestion.options.find(opt => opt.text === selectedOption);
    if (chosenOption) {
      handleQuizAnswer(chosenOption.isCorrect);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, maybe show summary or reset
      alert("クイズ完了！お疲れ様でした。");
      setCurrentQuestionIndex(0); // Reset for now
      // Optionally re-fetch questions for variety
       const fetchNewQuestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const quizDataString = await generateQuizQuestions();
           let parsedData;
           try {
                let jsonStr = quizDataString.trim();
                const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
                const match = jsonStr.match(fenceRegex);
                if (match && match[2]) {
                    jsonStr = match[2].trim();
                }
                parsedData = JSON.parse(jsonStr);
           } catch (parseError) {
                console.error("クイズデータのJSONパースエラー:", parseError, "Raw data:", quizDataString);
                throw new Error("受信したクイズデータの形式が正しくありません。");
           }
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setQuestions(parsedData);
          } else {
            throw new Error("クイズデータが空か、形式が正しくありません。");
          }
        } catch (e) {
          console.error("クイズ再取得エラー:", e);
          setError(e instanceof Error ? e.message : "クイズの再読み込みに失敗しました。");
        } finally {
          setIsLoading(false);
        }
      };
      fetchNewQuestions();
    }
  };

  if (isLoading) return <LoadingSpinner message="クイズを準備中..." />;
  if (error) return <div className="text-red-400 p-4 bg-red-900/30 rounded-md">{error}</div>;
  if (questions.length === 0) return <div className="text-yellow-400 p-4 bg-yellow-900/30 rounded-md">利用可能なクイズがありません。</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 bg-slate-800 shadow-2xl rounded-xl border border-slate-700">
      <div className="flex items-center text-2xl font-semibold text-sky-300 mb-6">
        <AcademicCapIcon className="h-8 w-8 mr-3 text-sky-400" />
        <span>情報リテラシークイズ ({currentQuestionIndex + 1}/{questions.length})</span>
      </div>
      
      <p className="text-lg text-gray-200 mb-6">{currentQuestion.questionText}</p>
      
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map(option => {
          const isSelected = selectedOption === option.text;
          let buttonClass = "w-full text-left p-4 rounded-lg transition-all duration-150 ease-in-out border-2 ";
          if (showFeedback) {
            if (option.isCorrect) {
              buttonClass += "bg-green-700/50 border-green-500 text-white font-semibold ring-2 ring-green-400";
            } else if (isSelected && !option.isCorrect) {
              buttonClass += "bg-red-700/50 border-red-500 text-white font-semibold ring-2 ring-red-400";
            } else {
              buttonClass += "bg-slate-700 border-slate-600 text-gray-300 opacity-70";
            }
          } else {
            buttonClass += isSelected 
              ? "bg-sky-600 border-sky-500 text-white ring-2 ring-sky-400" 
              : "bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-sky-500 text-gray-200";
          }
          return (
            <button
              key={option.text}
              onClick={() => handleOptionSelect(option.text)}
              disabled={showFeedback}
              className={buttonClass}
            >
              {option.text}
              {showFeedback && option.isCorrect && <CheckCircleIcon className="h-6 w-6 inline-block ml-2 text-green-300" />}
              {showFeedback && isSelected && !option.isCorrect && <XCircleIcon className="h-6 w-6 inline-block ml-2 text-red-300" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-md mb-6 ${
            currentQuestion.options.find(opt => opt.text === selectedOption)?.isCorrect 
            ? 'bg-green-800/70 border border-green-600' 
            : 'bg-red-800/70 border border-red-600'
          }`}
        >
          <div className="flex items-start">
            <LightBulbIcon className={`h-6 w-6 mr-2 mt-1 ${
                currentQuestion.options.find(opt => opt.text === selectedOption)?.isCorrect 
                ? 'text-green-300' 
                : 'text-red-300'
            }`}/>
            <div>
              <h4 className="font-semibold text-lg mb-1">
                {currentQuestion.options.find(opt => opt.text === selectedOption)?.isCorrect ? '正解！' : '不正解'}
              </h4>
              <p className="text-gray-200">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {!showFeedback && (
        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedOption}
          className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          回答する
        </button>
      )}
      {showFeedback && (
         <button
          onClick={handleNextQuestion}
          className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out"
        >
          {currentQuestionIndex < questions.length - 1 ? '次の問題へ' : 'クイズをもう一度'}
        </button>
      )}
    </div>
  );
};

export default QuizComponent;
