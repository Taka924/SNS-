
import React from 'react';
import { AnalysisData, SuggestedSource } from '../types';
import ScoreBadge from './ScoreBadge';
import { LightBulbIcon, LinkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AnalysisResultDisplayProps {
  data: AnalysisData;
}

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ data }) => {
  return (
    <div className="mt-8 p-6 bg-slate-800 shadow-2xl rounded-xl space-y-6 border border-slate-700">
      <ScoreBadge rating={data.reliability} />

      <div className="pt-4 border-t border-slate-700">
        <h4 className="text-lg font-semibold text-sky-300 flex items-center mb-2">
          <LightBulbIcon className="h-6 w-6 mr-2 text-sky-400" />
          AIによる分析と根拠:
        </h4>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed bg-slate-700/50 p-4 rounded-md">
          {data.explanation}
        </p>
      </div>

      {data.keywords_for_fact_check && data.keywords_for_fact_check.length > 0 && (
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-lg font-semibold text-sky-300 flex items-center mb-2">
            <MagnifyingGlassIcon className="h-6 w-6 mr-2 text-sky-400" />
            ファクトチェック用キーワード:
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.keywords_for_fact_check.map((keyword, index) => (
              <span key={index} className="px-3 py-1 bg-sky-700 text-sky-100 text-sm rounded-full shadow">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.suggested_sources && data.suggested_sources.length > 0 && (
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-lg font-semibold text-sky-300 flex items-center mb-2">
            <LinkIcon className="h-6 w-6 mr-2 text-sky-400" />
            関連情報源の候補:
          </h4>
          <ul className="space-y-2">
            {data.suggested_sources.map((source: SuggestedSource, index: number) => (
              <li key={index} className="bg-slate-700/50 p-3 rounded-md hover:bg-slate-600/50 transition-colors">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                >
                  {source.title || source.url}
                </a>
                {source.title && <p className="text-xs text-gray-400 break-all">{source.url}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* For debugging: Show raw response
      {data.raw_response && (
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-gray-400">デバッグ情報 (Raw Response):</h4>
          <pre className="text-xs text-gray-500 bg-slate-900 p-2 rounded overflow-x-auto">{data.raw_response}</pre>
        </div>
      )}
      */}
    </div>
  );
};

export default AnalysisResultDisplay;
