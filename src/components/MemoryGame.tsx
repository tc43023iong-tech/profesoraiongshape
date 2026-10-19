import React, { useState, useEffect, useRef } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Star, Trophy, BrainCircuit, Eye, EyeOff } from "lucide-react";

interface MemoryGameProps {
  onBack: () => void;
}

export default function MemoryGame({ onBack }: MemoryGameProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [activeWords, setActiveWords] = useState<Word[]>([]);
  const [missingWord, setMissingWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<Word[]>([]);
  
  const [countdown, setCountdown] = useState<number>(10);
  const [isMemorizing, setIsMemorizing] = useState<boolean>(true);
  
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const chapters = CHAPTERS;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = (chapter: string) => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    setGameStarted(true);
    loadRound(1, chapter);
  };

  const loadRound = (roundNum: number, chapter: string) => {
    setSelectedGuess(null);
    setIsCorrect(null);
    setCountdown(10);
    setIsMemorizing(true);

    let filtered = filterWordsByChapter(chapter);
    // Needs at least 8 words
    if (filtered.length < 8) {
      // populate with all if insufficient
      filtered = WORD_LIST;
    }

    // Shuffle and pick 8 words
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected8 = shuffled.slice(0, 8);
    setActiveWords(selected8);

    // After 10s or manually click, hide one word
    startTimer(selected8);
  };

  const startTimer = (current8: Word[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setCountdown(10);
    
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          triggerTestPhase(current8);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    triggerTestPhase(activeWords);
  };

  const triggerTestPhase = (memorized8: Word[]) => {
    setIsMemorizing(false);

    // Choose 1 random word to hide
    const randomIndex = Math.floor(Math.random() * memorized8.length);
    const hidden = memorized8[randomIndex];
    setMissingWord(hidden);

    // Shuffle the 8 options so they are presented in random order to guess which went missing
    const shuffledOptions = [...memorized8].sort(() => Math.random() - 0.5);
    setOptions(shuffledOptions);
  };

  const handleGuess = (guessWord: Word) => {
    if (selectedGuess !== null || missingWord === null) return;
    setSelectedGuess(guessWord.id);

    if (guessWord.id === missingWord.id) {
      setIsCorrect(true);
      setScore(prev => prev + 10);
      playCorrectSound();
    } else {
      setIsCorrect(false);
      playIncorrectSound();
    }

    // Auto load next round after 2 seconds
    setTimeout(() => {
      if (round < 5) {
        const nextRound = round + 1;
        setRound(nextRound);
        loadRound(nextRound, selectedChapter);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!gameStarted) {
    return (
      <div className="w-full bg-pink-50/50 p-6 rounded-3xl border-4 border-pink-200 text-center relative max-w-2xl mx-auto shadow-md">
        <div className="absolute top-2 left-2 text-3xl">🧠</div>
        <div className="absolute top-2 right-2 text-3xl">🎀</div>
        <h2 className="text-3xl font-extrabold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <span>Mind Memory 記憶大挑戰 🧠</span>
        </h2>
        <p className="text-pink-500 font-medium text-sm mb-6">
          你有 10 秒鐘的時間來記憶大白板上的 8 個單詞，放有中文解說。隨後會有一個單詞悄悄躲起來，猜猜看是哪一個呢？🦁
        </p>

        <div className="bg-white/80 p-6 rounded-2xl border-2 border-pink-100 mb-6 shadow-sm">
          <label className="block text-pink-700 font-extrabold text-base mb-3">
            🎀 請選擇要記憶的單詞範圍：
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {chapters.map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-4 py-2.5 rounded-full font-bold text-sm border-2 transition-all duration-150 cursor-pointer ${
                  selectedChapter === ch
                    ? "bg-pink-400 border-pink-500 text-white scale-105 shadow-md"
                    : "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700"
                }`}
              >
                {ch === "All" ? "🌟 全部單詞" : ch}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-400 border-b-4 border-slate-600 font-bold text-white rounded-full transition hover:bg-slate-500 flex items-center gap-2 cursor-pointer"
          >
            返回
          </button>
          <button
            onClick={() => startGame(selectedChapter)}
            className="px-8 py-3 bg-pink-500 border-b-4 border-pink-700 hover:bg-pink-600 font-extrabold text-white text-lg rounded-full transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>🚀 載入大腦 🎀</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-pink-300 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
        <Trophy className="w-20 h-20 text-yellow-500 fill-yellow-200 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-pink-600 mb-2">🎉 記憶大師！ 🎉</h2>
        <p className="text-slate-600 font-medium mb-6">
          你的雙眼和記憶力就像拍照一樣神準！恭喜通過 5 回合考驗！📸🎀
        </p>

        <div className="bg-pink-50 py-4 px-6 rounded-2xl border-2 border-pink-200 inline-block mb-6 shadow-inner">
          <span className="text-slate-500 text-xs font-bold block mb-1">FINAL SCORE 🏆</span>
          <span className="text-3xl font-black text-pink-600">總得分: {score} 分</span>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="px-6 py-2.5 bg-pink-400 border-b-4 border-pink-600 text-white font-bold rounded-full hover:bg-pink-500 transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>再玩一次</span>
          </button>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-slate-400 border-b-4 border-slate-600 text-white font-bold rounded-full hover:bg-slate-500 transition cursor-pointer"
          >
            🏠 返回選單
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-pink-50/50 p-6 rounded-3xl border-4 border-pink-200 shadow-lg relative">
      {/* HUD Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setGameStarted(false)}
          className="px-3 py-1.5 bg-white border-2 border-pink-200 rounded-full text-xs font-bold text-pink-600 hover:bg-pink-100 transition cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>重新選擇</span>
        </button>

        <div className="bg-pink-100 border border-pink-200 px-4 py-1.5 rounded-full text-xs font-black text-pink-600 flex items-center gap-1">
          <BrainCircuit className="w-3.5 h-3.5 text-pink-500" />
          <span>回合: {round} / 5</span>
        </div>

        <div className="bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-black text-emerald-700">
          總分: {score}
        </div>
      </div>

      {/* State 1: Memorization Phase */}
      {isMemorizing ? (
        <div className="animate-fade-in">
          <div className="bg-white p-5 rounded-2xl border-3 border-pink-100 shadow-sm text-center mb-6 relative">
            <div className="absolute top-2 right-4 text-emerald-500 flex items-center gap-1 font-black text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Eye className="w-4 h-4 animate-pulse" />
              <span>注意看！剩餘 {countdown} 秒</span>
            </div>

            <h3 className="text-xl font-bold text-pink-600 mb-2">💡 記住這 8 個單詞和中文！</h3>
            
            {/* Visual Progress Countdown */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 mt-2">
              <div 
                className="bg-pink-400 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {activeWords.map((word) => (
              <div
                key={word.id}
                className="bg-white p-4 border-3 border-pink-100 rounded-2xl flex flex-col items-center text-center justify-center min-h-[110px] shadow-sm relative overflow-hidden"
              >
                <span className="text-3xl mb-1">{word.emoji}</span>
                <span className="text-sm font-black text-slate-800 break-normal text-wrap w-full">
                  {word.english}
                </span>
                
                {/* mind memory在單詞旁放中文意思 */}
                <span className="text-[10px] text-pink-500 font-extrabold bg-pink-50 px-1.5 py-0.5 rounded-full mt-1">
                  ({word.chinese})
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={skipTimer}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 border-b-4 border-pink-700 text-white font-extrabold text-base rounded-2xl shadow-md cursor-pointer transition-all active:translate-y-0.5"
          >
            🎀 我記好囉！直接進入回答 ⚡
          </button>
        </div>
      ) : (
        /* State 2: Answer Guessing Phase */
        <div className="animate-fade-in">
          <div className="bg-white p-5 rounded-2xl border-3 border-pink-100 shadow-sm text-center mb-6 relative">
            <div className="absolute top-2 right-4 text-rose-500 flex items-center gap-1 font-black text-xs bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <EyeOff className="w-4 h-4" />
              <span>考試中！</span>
            </div>
            
            <h3 className="text-xl font-bold text-pink-600">🕵️‍♀️ 糟糕！一個單詞和中文溜走了！</h3>
            <p className="text-xs text-slate-500 mt-1">請看下面，選出「躲起來（不知哪裡去了）」的那個單詞：</p>
          </div>

          <p className="text-xs font-black text-slate-500 mb-2 uppercase text-center">剩餘留在場上的 7 個單詞：</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {activeWords.map((word) => {
              const isHidden = word.id === missingWord?.id;

              return (
                <div
                  key={word.id}
                  className={`p-4 rounded-2xl flex flex-col items-center text-center justify-center min-h-[110px] border-3 transition-opacity duration-300 relative ${
                    isHidden
                      ? "bg-stone-50 border-stone-200 border-dashed border-4 opacity-100 scale-98"
                      : "bg-white border-pink-150 shadow-sm"
                  }`}
                >
                  {isHidden ? (
                    <div className="flex flex-col items-center justify-center text-stone-300">
                      <span className="text-3xl animate-pulse">❓</span>
                      <span className="text-[10px] font-bold">誰不見了？</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl mb-1">{word.emoji}</span>
                      <span className="text-sm font-black text-slate-800 break-normal w-full">
                        {word.english}
                      </span>
                      <span className="text-[10px] text-pink-500 font-extrabold bg-pink-50 px-1.5 py-0.5 rounded-full mt-1">
                        ({word.chinese})
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* 8 Multiple-choice Options Selection */}
          <div className="bg-white p-5 rounded-2xl border-3 border-pink-100 shadow-sm">
            <p className="text-xs font-black text-pink-600 mb-3 text-center">👇 請選出剛才消失的那個單詞 🔍</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {options.map((option) => {
                const isSelected = selectedGuess === option.id;
                const isCorrectMissing = option.id === missingWord?.id;

                let cardStyle = "bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 text-pink-700 cursor-pointer";
                if (selectedGuess !== null) {
                  if (isSelected) {
                    cardStyle = isCorrect 
                      ? "bg-emerald-500 border-2 border-emerald-600 text-white font-black scale-95" 
                      : "bg-rose-500 border-2 border-rose-600 text-white font-black scale-95";
                  } else if (isCorrectMissing) {
                    cardStyle = "bg-emerald-300 border-2 border-emerald-500 text-emerald-950 font-black animate-pulse";
                  } else {
                    cardStyle = "bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleGuess(option)}
                    disabled={selectedGuess !== null}
                    className={`p-3 rounded-2xl font-bold text-xs md:text-sm text-center flex flex-col items-center transition-all duration-150 ${cardStyle}`}
                  >
                    <span className="text-xl block mb-0.5">{option.emoji}</span>
                    <span className="block break-all font-black">{option.english}</span>
                    <span className="text-[9px] opacity-80">({option.chinese})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer State Overlay Feedback Banner */}
          <div className="mt-4 h-12 flex items-center justify-center">
            {selectedGuess !== null && (
              <div className={`text-base font-black px-6 py-1.5 rounded-full border-2 ${
                isCorrect 
                  ? "bg-emerald-100 border-emerald-300 text-emerald-700 animate-bounce" 
                  : "bg-rose-100 border-rose-300 text-rose-700"
              }`}>
                {isCorrect ? "✨ 太厲害了！你真是記憶超人！ 🧠🏅" : `💡 哎呀！剛才偷偷躲起來的是: ${missingWord?.english} (${missingWord?.chinese})`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
