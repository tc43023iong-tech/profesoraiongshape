import React, { useState } from "react";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { ArrowLeft, CheckCircle2, RefreshCw, Sparkles, HelpCircle, Trophy, BookOpen, Layers } from "lucide-react";

interface ComoEExGProps {
  onBack: () => void;
}

interface QuestionItem {
  id: number;
  question: string;
  questionChinese: string;
  itemEmoji: string;
  prefixPrompt?: string; // e.g. "A porta é " for #1, #2; empty for #3, #4, #5, #6 where student builds full sentence
  correctAdjective: "redondo" | "redonda" | "quadrado" | "quadrada" | "retangular";
  altAdjectives?: ("redondo" | "redonda" | "quadrado" | "quadrada" | "retangular")[]; // e.g. janela can also be retangular
  fullSentence: string;
  altFullSentences?: string[];
  sentenceChinese: string;
  grammarTip: string;
  // Word tokens available for word-by-word sentence builder
  wordTokens: string[];
}

const SHAPE_WORD_BANK = [
  { word: "redondo", label: "redondo", note: "圓形 (陽性 -o)", bg: "bg-blue-100 border-blue-500 text-blue-900" },
  { word: "redonda", label: "redonda", note: "圓形 (陰性 -a)", bg: "bg-pink-100 border-pink-500 text-pink-900" },
  { word: "quadrado", label: "quadrado", note: "正方形 (陽性 -o)", bg: "bg-emerald-100 border-emerald-500 text-emerald-900" },
  { word: "quadrada", label: "quadrada", note: "正方形 (陰性 -a)", bg: "bg-teal-100 border-teal-500 text-teal-900" },
  { word: "retangular", label: "retangular", note: "長方形 (變形超人 ⭐)", bg: "bg-amber-100 border-amber-500 text-amber-950 font-black ring-2 ring-yellow-400" }
];

const QUESTIONS_DATA: QuestionItem[] = [
  {
    id: 1,
    question: "Como é a porta?",
    questionChinese: "大門是什麼形狀的？",
    itemEmoji: "🚪",
    prefixPrompt: "A porta é ",
    correctAdjective: "retangular",
    fullSentence: "A porta é retangular.",
    sentenceChinese: "門是長方形的。",
    grammarTip: "a porta 是陰性名詞 (a)，形狀為長方形。長方形是「變形超人 retangular」，男女衣服都不變！",
    wordTokens: ["A", "porta", "é", "retangular", "quadrada", "redonda", "."]
  },
  {
    id: 2,
    question: "Como é a cadeira?",
    questionChinese: "椅子（座墊）是什麼形狀的？",
    itemEmoji: "🪑",
    prefixPrompt: "A cadeira é ",
    correctAdjective: "quadrada",
    fullSentence: "A cadeira é quadrada.",
    sentenceChinese: "椅子是正方形的。",
    grammarTip: "a cadeira 是陰性名詞 (a)，正方形陰性結尾配合「-a」，所以用 quadrada！",
    wordTokens: ["A", "cadeira", "é", "quadrada", "quadrado", "retangular", "."]
  },
  {
    id: 3,
    question: "Como é a televisão?",
    questionChinese: "電視機是什麼形狀的？",
    itemEmoji: "📺",
    prefixPrompt: "",
    correctAdjective: "retangular",
    altAdjectives: ["quadrada"],
    fullSentence: "A televisão é retangular.",
    altFullSentences: ["A televisão é quadrada."],
    sentenceChinese: "電視機是長方形的。",
    grammarTip: "a televisão 是陰性名詞 (a)。電視機通常是長方形，因此回答 A televisão é retangular.！",
    wordTokens: ["A", "televisão", "é", "retangular", "O", "quadrada", "."]
  },
  {
    id: 4,
    question: "Como é a janela?",
    questionChinese: "窗戶是什麼形狀的？",
    itemEmoji: "🪟",
    prefixPrompt: "",
    correctAdjective: "quadrada",
    altAdjectives: ["retangular"],
    fullSentence: "A janela é quadrada.",
    altFullSentences: ["A janela é retangular."],
    sentenceChinese: "窗戶是正方形的。",
    grammarTip: "a janela 是陰性名詞 (a)。窗戶是正方形，陰性配合「-a」，因此回答 A janela é quadrada.！",
    wordTokens: ["A", "janela", "é", "quadrada", "O", "retangular", "."]
  },
  {
    id: 5,
    question: "Como é o armário?",
    questionChinese: "衣櫃/壁櫥是什麼形狀的？",
    itemEmoji: "🗄️",
    prefixPrompt: "",
    correctAdjective: "retangular",
    fullSentence: "O armário é retangular.",
    sentenceChinese: "衣櫃是長方形的。",
    grammarTip: "o armário 是陽性名詞 (o)。衣櫃是長方形，長方形變形超人 retangular 男女衣服都不變！",
    wordTokens: ["O", "armário", "é", "retangular", "A", "quadrado", "."]
  },
  {
    id: 6,
    question: "Como é o frigorífico?",
    questionChinese: "冰箱是什麼形狀的？",
    itemEmoji: "🧊",
    prefixPrompt: "",
    correctAdjective: "retangular",
    fullSentence: "O frigorífico é retangular.",
    sentenceChinese: "冰箱是長方形的。",
    grammarTip: "o frigorífico 是陽性名詞 (o)。冰箱是長方形，使用 retangular！",
    wordTokens: ["O", "frigorífico", "é", "retangular", "A", "redondo", "."]
  }
];

export default function ComoEExG({ onBack }: ComoEExGProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [selectedAdjective, setSelectedAdjective] = useState<string | null>(null);
  
  // Track status for each of the 6 questions
  const [answeredState, setAnsweredState] = useState<Record<number, { isCorrect: boolean; answer: string }>>({});
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showAllSummary, setShowAllSummary] = useState<boolean>(false);

  const currentQ = QUESTIONS_DATA[currentIdx];

  // Helper: Reset current question input
  const handleResetCurrent = () => {
    setUserWords([]);
    setSelectedAdjective(null);
    setFeedback(null);
  };

  // When user clicks a token from word bank to build sentence
  const handleAddWordToken = (token: string) => {
    setUserWords(prev => [...prev, token]);
    setFeedback(null);
  };

  // When user removes a token from the built sentence
  const handleRemoveWordToken = (indexToRemove: number) => {
    setUserWords(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setFeedback(null);
  };

  // When user clicks direct shape adjective selection
  const handleSelectAdjective = (adj: string) => {
    setSelectedAdjective(adj);
    setFeedback(null);

    // If there is prefix prompt (Questions 1 & 2), this is a 1-click completion!
    if (currentQ.prefixPrompt) {
      checkAnswer(adj);
    }
  };

  // Check the answer
  const checkAnswer = (chosenAdj?: string) => {
    const adjToCheck = chosenAdj || selectedAdjective;
    const constructedSentence = userWords.join(" ").trim();

    let isSuccess = false;

    // Check by constructed sentence
    if (userWords.length > 0) {
      const cleanConstructed = constructedSentence.replace(/\s+\./g, ".").toLowerCase();
      const cleanTarget = currentQ.fullSentence.toLowerCase();
      const altTargets = (currentQ.altFullSentences || []).map(s => s.toLowerCase());

      if (cleanConstructed === cleanTarget || altTargets.includes(cleanConstructed)) {
        isSuccess = true;
      }
    }

    // Check by chosen adjective
    if (adjToCheck) {
      if (adjToCheck === currentQ.correctAdjective || currentQ.altAdjectives?.includes(adjToCheck as any)) {
        isSuccess = true;
      }
    }

    if (isSuccess) {
      playCorrectSound();
      const completeAnswerText = currentQ.fullSentence;
      setAnsweredState(prev => ({
        ...prev,
        [currentQ.id]: { isCorrect: true, answer: completeAnswerText }
      }));
      setFeedback({
        isCorrect: true,
        message: `太棒了！正確答案是：${completeAnswerText} (${currentQ.sentenceChinese})。💡 ${currentQ.grammarTip}`
      });
    } else {
      playIncorrectSound();
      setFeedback({
        isCorrect: false,
        message: `再想一想！提示：${currentQ.grammarTip}`
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS_DATA.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserWords([]);
      setSelectedAdjective(null);
      setFeedback(null);
    } else {
      setShowAllSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setUserWords([]);
      setSelectedAdjective(null);
      setFeedback(null);
    }
  };

  const totalAnswered = Object.keys(answeredState).length;

  return (
    <div className="w-full bg-[#FFF8E7] p-4 md:p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 border-b-3 border-black pb-4">
        <button
          onClick={onBack}
          className="mario-btn mario-btn-gray px-4 py-2 text-xs md:text-sm text-white flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回大廳</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black font-pixel text-stone-900 drop-shadow flex items-center justify-center gap-2">
            <span>G. COMPLETAR COM AS PALAVRAS SEGUINTES 📝</span>
          </h2>
          <p className="text-xs text-stone-700 font-bold">
            回答物件的形狀 • 一個單詞一個單詞點來組句 / 填空選擇
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-pixel bg-amber-300 border-2 border-black px-3 py-1.5 rounded-xl font-black text-stone-900 shadow-[2px_2px_0px_#000]">
            進度: {totalAnswered} / 6
          </span>
        </div>
      </div>

      {/* 5 Core Word Bank Display Box */}
      <div className="bg-white border-3 border-black rounded-2xl p-4 mb-6 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-pixel text-stone-800 font-bold flex items.center gap-1.5">
            <span>📦 BANCO DE PALAVRAS • 形狀候選單詞庫：</span>
          </span>
          <span className="text-[11px] text-stone-500 font-bold">
            請根據名詞陰陽性與形狀選擇
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SHAPE_WORD_BANK.map((item) => (
            <button
              key={item.word}
              onClick={() => handleSelectAdjective(item.word)}
              className={`p-2.5 rounded-xl border-3 ${item.bg} shadow-[2px_2px_0px_#000] hover:scale-103 active:scale-95 transition-all text-center cursor-pointer select-none ${
                selectedAdjective === item.word ? "ring-4 ring-black font-black scale-105" : ""
              }`}
            >
              <div className="text-base md:text-lg font-black tracking-tight">{item.label}</div>
              <div className="text-[10px] font-bold opacity-80 mt-0.5">{item.note}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Question Selector Tabs 1 - 6 */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {QUESTIONS_DATA.map((q, idx) => {
          const isDone = answeredState[q.id]?.isCorrect;
          const isCurrent = currentIdx === idx && !showAllSummary;

          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentIdx(idx);
                setShowAllSummary(false);
                setUserWords([]);
                setSelectedAdjective(null);
                setFeedback(null);
              }}
              className={`w-10 h-10 rounded-xl border-3 font-pixel text-xs font-black flex items-center justify-center cursor-pointer transition-all select-none ${
                isCurrent
                  ? "bg-[#E52521] text-white border-black scale-110 shadow-[3px_3px_0px_#000]"
                  : isDone
                  ? "bg-emerald-400 text-black border-black shadow-[2px_2px_0px_#000]"
                  : "bg-white text-stone-700 border-stone-400 hover:bg-stone-100"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}

        <button
          onClick={() => setShowAllSummary(true)}
          className={`px-3 py-2 rounded-xl border-3 font-pixel text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
            showAllSummary
              ? "bg-[#E52521] text-white border-black shadow-[3px_3px_0px_#000]"
              : "bg-white text-stone-700 border-black hover:bg-amber-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>全套總結</span>
        </button>
      </div>

      {/* Main Single Question Interactive View */}
      {!showAllSummary && (
        <div className="bg-white border-4 border-black rounded-3xl p-5 md:p-8 max-w-3xl mx-auto shadow-[6px_6px_0px_#000] relative">
          {/* Question Title & Emoji */}
          <div className="flex items-center gap-4 mb-5 border-b-2 border-stone-200 pb-4">
            <span className="text-5xl md:text-6xl p-3 bg-amber-100 border-3 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              {currentQ.itemEmoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-pixel bg-[#E52521] text-white px-2 py-0.5 rounded-md font-black">
                  QUESTION {currentQ.id} / 6
                </span>
                <span className="text-xs text-stone-500 font-bold">
                  {currentQ.questionChinese}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-stone-900 mt-1">
                {currentQ.question}
              </h3>
            </div>
          </div>

          {/* Sentence Line with Blanks or Built Sentence */}
          <div className="bg-[#FFF8E7] border-3 border-black rounded-2xl p-5 mb-5 shadow-inner">
            <span className="text-xs font-pixel text-amber-800 block mb-2 font-bold">
              RESPOSTA • 你的答案：
            </span>

            {/* If Prefix exists (Questions 1 & 2) */}
            {currentQ.prefixPrompt ? (
              <div className="text-xl md:text-2xl font-black text-stone-900 flex items-center flex-wrap gap-2">
                <span>{currentQ.prefixPrompt}</span>
                <span className={`px-4 py-1.5 rounded-xl border-2 border-dashed min-w-[160px] text-center inline-block ${
                  selectedAdjective
                    ? "bg-amber-300 border-amber-600 text-stone-950 font-black shadow-sm"
                    : "bg-white border-stone-400 text-stone-400"
                }`}>
                  {selectedAdjective || "____________________"}
                </span>
                <span>.</span>
              </div>
            ) : (
              /* Full sentence blank (Questions 3, 4, 5, 6) */
              <div>
                {userWords.length > 0 ? (
                  <div className="flex items-center flex-wrap gap-2 min-h-12 p-2 bg-white rounded-xl border-2 border-amber-400">
                    {userWords.map((token, wIdx) => (
                      <span
                        key={wIdx}
                        onClick={() => handleRemoveWordToken(wIdx)}
                        className="px-3 py-1 bg-amber-400 border-2 border-black rounded-lg text-base md:text-lg font-black text-black cursor-pointer hover:bg-red-400 hover:text-white transition-all shadow-[2px_2px_0px_#000] active:scale-95 select-none"
                        title="點擊移除此單詞"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-lg md:text-xl font-bold text-stone-400 border-b-2 border-dashed border-stone-400 pb-2">
                    ____________________________________________________________ .
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Word-by-word Click Tokens for Full Sentence Building */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <span>👆 點擊單詞一個個拼成句子 (點詞組句)：</span>
              </span>
              {userWords.length > 0 && (
                <button
                  onClick={handleResetCurrent}
                  className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>清除重排</span>
                </button>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {currentQ.wordTokens.map((token, tIdx) => (
                <button
                  key={tIdx}
                  onClick={() => handleAddWordToken(token)}
                  className="mario-btn mario-btn-yellow px-4 py-2 text-base md:text-lg font-black text-black cursor-pointer shadow-[3px_3px_0px_#000] select-none"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Action Check Button */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => checkAnswer()}
              className="mario-btn mario-btn-red px-6 py-3 text-white font-black text-base flex-1 flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>驗證答案 (Verificar)</span>
            </button>

            <button
              onClick={handleResetCurrent}
              className="mario-btn mario-btn-gray px-4 py-3 text-white font-bold text-sm cursor-pointer"
            >
              重置
            </button>
          </div>

          {/* Feedback Area */}
          {feedback && (
            <div className={`p-4 rounded-2xl border-3 mb-5 text-sm md:text-base font-bold ${
              feedback.isCorrect
                ? "bg-emerald-100 border-emerald-600 text-emerald-950 animate-bounce"
                : "bg-red-100 border-red-500 text-red-950"
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Next / Previous Question Navigation */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-stone-200">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className={`mario-btn px-4 py-2 text-xs md:text-sm font-bold ${
                currentIdx === 0 ? "opacity-40 cursor-not-allowed bg-stone-300" : "mario-btn-yellow text-black cursor-pointer"
              }`}
            >
              ⬅ 上一題
            </button>

            <span className="text-xs font-pixel text-stone-500">
              {currentIdx + 1} OF 6
            </span>

            <button
              onClick={handleNext}
              className="mario-btn mario-btn-blue px-5 py-2 text-xs md:text-sm text-white font-black cursor-pointer"
            >
              {currentIdx === QUESTIONS_DATA.length - 1 ? "查看全部總結 🎓" : "下一題 ➡"}
            </button>
          </div>
        </div>
      )}

      {/* All 6 Questions Summary Card View */}
      {showAllSummary && (
        <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-[6px_6px_0px_#000] animate-fade-in">
          <div className="text-center mb-6">
            <span className="text-5xl animate-bounce inline-block mb-1">🎓📋✨</span>
            <h3 className="text-2xl font-black text-stone-900 font-pixel">
              G. RESUMO COMPLETO DAS FRASES
            </h3>
            <p className="text-xs md:text-sm text-stone-600 font-bold mt-1">
              全套 6 題物件形狀標準問答一覽表
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {QUESTIONS_DATA.map((q) => {
              const isDone = answeredState[q.id]?.isCorrect;

              return (
                <div
                  key={q.id}
                  className="bg-amber-50 border-3 border-black rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[2px_2px_0px_#000]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{q.itemEmoji}</span>
                    <div>
                      <div className="text-xs font-pixel text-[#E52521] font-bold">
                        {q.id}. {q.question}
                      </div>
                      <div className="text-base font-black text-stone-900 mt-0.5">
                        {q.fullSentence}
                      </div>
                      <div className="text-xs text-stone-500 font-bold">
                        {q.sentenceChinese}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white border-2 border-black rounded-xl text-xs font-black text-stone-800">
                      {q.correctAdjective}
                    </span>
                    {isDone ? (
                      <span className="text-emerald-600 font-black text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                        <span>已通關</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentIdx(q.id - 1);
                          setShowAllSummary(false);
                          handleResetCurrent();
                        }}
                        className="mario-btn mario-btn-yellow px-3 py-1 text-xs text-black font-black"
                      >
                        去練習
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setShowAllSummary(false);
                setCurrentIdx(0);
                handleResetCurrent();
              }}
              className="mario-btn mario-btn-yellow px-6 py-2.5 text-black font-black flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重頭再練一遍</span>
            </button>
            <button
              onClick={onBack}
              className="mario-btn mario-btn-red px-6 py-2.5 text-white font-black cursor-pointer"
            >
              返回主頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
