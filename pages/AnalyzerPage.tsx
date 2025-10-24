
import React, { useState, useCallback } from 'react';
import { analyzeText } from '../services/geminiService';
import { AnalysisData, ReliabilityRating } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResultDisplay from '../components/AnalysisResultDisplay';
import { MAX_TEXT_LENGTH } from '../constants';
import { DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AnalyzerPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) {
      setError('分析するテキストを入力してください。');
      return;
    }
    if (inputText.length > MAX_TEXT_LENGTH) {
      setError(`テキストが長すぎます。最大${MAX_TEXT_LENGTH}文字までです。`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeText(inputText);
      setAnalysisResult(result);
    } catch (e) {
      console.error("分析エラー:", e);
      setError(e instanceof Error ? e.message : '分析中に不明なエラーが発生しました。');
      setAnalysisResult({
        reliability: ReliabilityRating.UNKNOWN,
        explanation: '分析中にエラーが発生しました。しばらくしてから再度お試しください。',
        keywords_for_fact_check: []
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const characterCount = inputText.length;
  const isOverLimit = characterCount > MAX_TEXT_LENGTH;

  return (
    <div className="space-y-8">
      <div className="p-8 bg-slate-800 shadow-2xl rounded-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-sky-300 mb-6 flex items-center">
          <DocumentTextIcon className="h-10 w-10 mr-3 text-sky-400" />
          SNS投稿分析ツール
        </h2>
        <p className="text-gray-400 mb-6">
          ここにSNSの投稿内容や気になる情報を入力してください。AIが内容を分析し、偽情報や誤情報である可能性について評価します。
        </p>
        
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (error) setError(null); // Clear error on input change
          }}
          placeholder="分析したいテキストをここに入力... (例: 「〇〇でデマが拡散されているらしい！」)"
          className={`w-full h-48 p-4 bg-slate-700 text-gray-200 border-2 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 ease-in-out placeholder-gray-500 ${isOverLimit ? 'border-red-500 focus:ring-red-500' : 'border-slate-600'}`}
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-2 mb-6">
            <p className={`text-sm ${isOverLimit ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
              {characterCount}/{MAX_TEXT_LENGTH} 文字
            </p>
            {isOverLimit && (
                <span className="text-xs text-red-400 flex items-center"><ExclamationTriangleIcon className="h-4 w-4 mr-1"/>文字数制限を超えています</span>
            )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !inputText.trim() || isOverLimit}
          className="w-full px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              分析中...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 group-hover:animate-pulse">
                <path d="M11.25 3.75c-1.26 0-2.446.468-3.354 1.266L3.75 9.162V4.5A.75.75 0 0 0 3 3.75H1.5a.75.75 0 0 0-.75.75v6.75c0 .414.336.75.75.75h6.75a.75.75 0 0 0 .75-.75V9A.75.75 0 0 0 7.5 8.25H5.338l3.507-4.09a4.483 4.483 0 0 1 2.405-.71 4.5 4.5 0 0 1 4.5 4.5c0 .72-.176 1.403-.495 2.007A.75.75 0 0 0 15.75 11.25H18a.75.75 0 0 0 .75-.75 6 6 0 0 0-6.75-6.75Zm.75 9.75a.75.75 0 0 0-.75.75v1.508L7.301 19.91a4.483 4.483 0 0 1-2.404.71 4.5 4.5 0 0 1-4.5-4.5c0-.72.176-1.403.495-2.007A.75.75 0 0 0 .375 12.75H-2.25a.75.75 0 0 0-.75.75 6 6 0 0 0 6.75 6.75c1.26 0 2.446-.468 3.354-1.266l4.146-4.146V20.25a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-6.75Z" />
              </svg>
              分析を実行
            </>
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg shadow-md flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 mr-3 text-red-400" />
            {error}
          </div>
        )}
      </div>

      {isLoading && <LoadingSpinner message="AIがテキストを分析中です。少々お待ちください..."/>}
      {analysisResult && !isLoading && <AnalysisResultDisplay data={analysisResult} />}
    </div>
  );
};

export default AnalyzerPage;
