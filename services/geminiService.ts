
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AnalysisData, ReliabilityRating, SuggestedSource } from '../types';
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (!API_KEY) {
  console.error("APIキーが設定されていません。環境変数 'API_KEY' を設定してください。AI機能は利用できません。");
} else {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("GoogleGenAIクライアントの初期化に失敗しました:", e);
    ai = null; // Ensure ai is null if initialization fails
  }
}

interface GeminiJsonResponse {
  reliability: ReliabilityRating;
  explanation: string;
  keywords_for_fact_check: string[];
  suggested_sources?: SuggestedSource[];
}

export const analyzeText = async (text: string): Promise<AnalysisData> => {
  if (!ai) { // Check if ai was initialized
    console.warn("Gemini AI client not initialized. Returning default error response for analyzeText.");
    return {
      reliability: ReliabilityRating.UNKNOWN,
      explanation: "AIクライアントが初期化されていないため、分析を実行できませんでした。APIキーの設定を確認してください。",
      keywords_for_fact_check: [],
    };
  }
  
  const systemInstructionText = `あなたはSNS上の偽情報・誤情報リスクを判定する専門家AIです。提供されたテキストを分析し、以下のJSON形式で回答してください:
{
  "reliability": "<HIGHLY_SUSPICIOUS|POTENTIALLY_MISLEADING|NEEDS_VERIFICATION|LIKELY_ACCURATEの中から選択>",
  "explanation": "<分析結果と根拠を日本語で記述>",
  "keywords_for_fact_check": ["<ファクトチェック用のキーワード1>", "<キーワード2>"],
  "suggested_sources": [{"title": "<記事タイトル>", "url": "<URL>"}, {"title": "<記事タイトル2>", "url": "<URL2>"}] 
}
分析の際は、扇動的な言葉遣い、根拠の欠如、一方的な主張、緊急性を煽る表現、不自然なURLなどに注意してください。
suggested_sourcesは関連性が高いものがあれば最大2つまで含めてください。無ければ省略可能です。
回答は日本語でお願いします。`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: text,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
        systemInstruction: systemInstructionText,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as GeminiJsonResponse;

    const isValidRating = Object.values(ReliabilityRating).includes(parsedData.reliability);

    return {
      reliability: isValidRating ? parsedData.reliability : ReliabilityRating.UNKNOWN,
      explanation: parsedData.explanation || "説明がありませんでした。",
      keywords_for_fact_check: parsedData.keywords_for_fact_check || [],
      suggested_sources: parsedData.suggested_sources || [],
      raw_response: response.text,
    };

  } catch (error) {
    console.error("Gemini API呼び出しエラー (analyzeText):", error);
    let errorMessage = "分析中にエラーが発生しました。";
    if (error instanceof Error) {
        errorMessage += ` 詳細: ${error.message}`;
    }
    return {
      reliability: ReliabilityRating.UNKNOWN,
      explanation: errorMessage,
      keywords_for_fact_check: [],
    };
  }
};

export const generateQuizQuestions = async (): Promise<string> => {
  if (!ai) { // Check if ai was initialized
    console.warn("Gemini AI client not initialized. Returning error string for generateQuizQuestions.");
    // Return a string that will lead to an error message in QuizComponent's parser
    return Promise.resolve("AIクライアントが初期化されていないため、クイズを生成できません。APIキーの設定を確認してください。");
  }

  const promptText = `偽情報に関する3択クイズを3問、以下のJSON形式で生成してください。各問題には簡単な解説も付けてください。
  [
    {
      "id": "q1",
      "questionText": "問題文",
      "options": [
        {"text": "選択肢1", "isCorrect": false},
        {"text": "選択肢2", "isCorrect": true},
        {"text": "選択肢3", "isCorrect": false}
      ],
      "explanation": "正解の簡単な解説"
    }
    // 重要: 上記の形式に厳密に従って、3問のクイズを生成してください。配列でラップし、各要素が1つの問題オブジェクトです。
    // 例をもう一つ追加します:
    // ,{
    //   "id": "q2",
    //   "questionText": "フェイクニュースを特定する際に最も重要なことは何ですか？",
    //   "options": [
    //     {"text": "感情的な見出しであること", "isCorrect": false},
    //     {"text": "情報源の信頼性を確認すること", "isCorrect": true},
    //     {"text": "シェア数が多いこと", "isCorrect": false}
    //   ],
    //   "explanation": "情報源の信頼性確認はフェイクニュースを見抜く基本です。"
    // }
  ]
  `;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("クイズ生成エラー (generateQuizQuestions):", error);
    let errorMessage = "クイズの生成に失敗しました。";
     if (error instanceof Error) {
        errorMessage += ` 詳細: ${error.message}`;
    }
    return Promise.resolve(errorMessage); // Return the error message string
  }
};
