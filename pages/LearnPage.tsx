
import React from 'react';
import { useResilienceScore } from '../hooks/useResilienceScore';
import QuizComponent from '../components/QuizComponent';
import { ChartBarIcon, UserCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const LearnPage: React.FC = () => {
  const { score } = useResilienceScore();

  const getScoreColor = () => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-sky-400';
    if (score >= 25) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const scoreMessage = () => {
    if (score >= 85) return "素晴らしいです！情報を見抜く力が非常に高いですね。";
    if (score >= 70) return "良い調子です！情報リテラシーが高いレベルにあります。";
    if (score >= 50) return "まずまずです。さらに学びを深めていきましょう。";
    if (score >= 25) return "まだ改善の余地がありそうです。クイズで練習しましょう！";
    return "情報リテラシー向上のため、積極的に学習しましょう！";
  }

  return (
    <div className="space-y-10">
      <section className="p-8 bg-slate-800 shadow-2xl rounded-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-sky-300 mb-6 flex items-center">
          <UserCircleIcon className="h-10 w-10 mr-3 text-sky-400" />
          あなたの情報耐性スコア
        </h2>
        <div className="text-center mb-4">
          <p className={`text-7xl font-extrabold ${getScoreColor()}`}>{score}</p>
          <p className="text-gray-400 mt-1">/ 100 ポイント</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-6 mb-4 overflow-hidden border border-slate-600">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${score >= 75 ? 'bg-green-500' : score >=50 ? 'bg-sky-500' : score >= 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-300">{scoreMessage()}</p>
        <p className="text-xs text-center text-gray-500 mt-2">このスコアは、クイズの正答率に基づいて算出されます。</p>
      </section>

      <section className="p-8 bg-slate-800 shadow-2xl rounded-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-sky-300 mb-6 flex items-center">
          <ChartBarIcon className="h-10 w-10 mr-3 text-sky-400" />
          情報リテラシークイズ
        </h2>
        <p className="text-gray-400 mb-6">
          偽情報や誤情報を見抜くための知識をクイズ形式で試してみましょう。正解するとスコアがアップします！
        </p>
        <QuizComponent />
      </section>

      <section className="p-8 bg-slate-800 shadow-2xl rounded-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-sky-300 mb-6 flex items-center">
          <BookOpenIcon className="h-10 w-10 mr-3 text-sky-400" />
          偽情報について学ぶ
        </h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            SNS上には、意図的に作られた偽情報や、誤って広まってしまう情報が数多く存在します。
            これらの情報に惑わされないためには、情報リテラシーを高めることが重要です。
          </p>
          <h4 className="text-xl font-semibold text-sky-400 pt-2">偽情報を見抜くポイント:</h4>
          <ul className="list-disc list-inside space-y-2 pl-4 marker:text-sky-400">
            <li><span className="font-semibold">情報源を確認する:</span> 発信者は信頼できる組織や人物か？公式サイトや一次情報か？</li>
            <li><span className="font-semibold">複数の情報源と比較する:</span> 他のニュースサイトや専門家の意見も調べてみる。</li>
            <li><span className="font-semibold">感情的な言葉遣いに注意する:</span> 過度に不安を煽ったり、怒りを誘うような表現はないか？</li>
            <li><span className="font-semibold">日付を確認する:</span> 古い情報が新しい出来事のように拡散されていないか？</li>
            <li><span className="font-semibold">画像や動画の信憑性を疑う:</span> 加工されていたり、文脈と異なる使われ方をしていないか？</li>
            <li><span className="font-semibold">URLを確認する:</span> 公式サイトに似せた偽サイトではないか？</li>
          </ul>
          <p>
            このアプリの分析ツールやクイズを活用して、情報を見極める力を養いましょう。
          </p>
        </div>
      </section>
    </div>
  );
};

export default LearnPage;
