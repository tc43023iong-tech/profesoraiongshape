import React, { useState, useEffect } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Star, HelpCircle, Trophy } from "lucide-react";

interface EmojiDetectiveProps {
  onBack: () => void;
}

export default function EmojiDetective({ onBack }: EmojiDetectiveProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const chapters = CHAPTERS;

  // Prepare questions
  const startGame = (chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    // Shuffle questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    if (shuffled.length === 0) return;
    
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameOver(false);
    setGameStarted(true);
    generateOptions(shuffled[0], filtered);
  };

  const generateOptions = (currentWord: Word, pool: Word[]) => {
    // Generate 4 options: 1 correct, 3 distractor
    const distractors = pool.filter(w => w.id !== currentWord.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffledDistractors.slice(0, 3);
    
    const finalOptions = [currentWord, ...selectedDistractors].sort(() => Math.random() - 0.5);
    setOptions(finalOptions);
  };

  const handleSelect = (option: Word) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks
    setSelectedAnswer(option.id);
    const currentWord = questions[currentIndex];
    
    if (option.id === currentWord.id) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      playCorrectSound();
    } else {
      setIsCorrect(false);
      playIncorrectSound();
    }

    // Auto proceed after 1.5 seconds
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setSelectedAnswer(null);
        setIsCorrect(null);
        let filteredPool = WORD_LIST.filter(w => selectedChapter === "All" || w.chapter === selectedChapter);
        generateOptions(questions[nextIndex], filteredPool);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  if (!gameStarted) {
    return (
      <div className="w-full bg-[#FFF0F5] p-8 rounded-3xl border-4 border-[#FF69B4] text-center relative max-w-2xl mx-auto shadow-2xl">
        <div className="absolute top-3 left-3 text-3xl">🧩</div>
        <div className="absolute top-3 right-3 text-3xl">🔍</div>
        <h2 className="text-3xl font-black text-[#FF1493] mb-3 flex items-center justify-center gap-2">
          <span>Emoji Detective 🔍 表情偵探</span>
        </h2>
        <p className="text-[#FF69B4] font-bold text-sm mb-6 bg-white py-2 px-4 rounded-full border border-[#FFF0F5] inline-block shadow-sm">
          看英文單詞，找出屬於它的 Emoji 吧！每個表情下方會提供中文意思引導。🌸
        </p>

        <div className="bg-white p-6 rounded-2xl border-3 border-[#FFB6C1] mb-6 shadow-md">
          <label className="block text-[#FF1493] font-black text-base mb-3">
            🎀 請選擇要大顯身手的單詞範圍：
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {chapters.map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-4 py-2.5 rounded-full font-black text-xs md:text-sm border-2 transition-all duration-150 cursor-pointer ${
                  selectedChapter === ch
                    ? "bg-[#FF1493] border-[#FF69B4] text-white scale-105 shadow-md"
                    : "bg-[#FFF5F7] hover:bg-[#FFF0F5] border-[#FFB6C1] text-[#FF1493]"
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
            className="px-8 py-3 bg-[#FF1493] border-b-4 border-[#FF69B4] hover:bg-[#FF69B4] font-black text-white text-lg rounded-full transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>🚀 開始遊戲 🎀</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-pink-300 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-100 rounded-full opacity-50"></div>
        
        <Trophy className="w-20 h-20 text-yellow-400 fill-yellow-200 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-pink-600 mb-2">🎉 偵探任務完成！ 🎉</h2>
        <p className="text-slate-600 font-medium mb-6">
          你找到了好多躲藏的單詞表情！真是太厲害了！💖
        </p>

        <div className="bg-pink-50 py-4 px-6 rounded-2xl border-2 border-pink-200 inline-block mb-6 shadow-inner">
          <span className="text-slate-500 text-xs font-bold block mb-1">FINAL SCORE 🏆</span>
          <span className="text-3xl font-black text-pink-600">{score} / {questions.length} 分</span>
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

  const currentWord = questions[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-3xl border-4 border-[#FFB6C1] shadow-2xl relative">
      {/* HUD Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setGameStarted(false)}
          className="px-3 py-1.5 bg-white border-2 border-[#FFB6C1] rounded-full text-xs font-black text-[#FF1493] hover:bg-[#FFF0F5] transition cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>重新選擇</span>
        </button>

        <div className="bg-[#FFF0F5] border-2 border-[#FFB6C1] px-4 py-1.5 rounded-full text-xs font-black text-[#FF1493] flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#FF69B4] text-[#FF1493]" />
          <span>題目: {currentIndex + 1} / {questions.length}</span>
        </div>

        <div className="bg-emerald-100 border-2 border-emerald-300 px-4 py-1.5 rounded-full text-xs font-black text-emerald-700 shadow-sm">
          得分: {score}
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-[#FFF5F7] p-6 rounded-2xl border-3 border-[#FFB6C1] shadow-inner text-center mb-6 relative overflow-hidden">
        <div className="absolute top-2 left-2 text-pink-200 text-4xl select-none opacity-40">💬</div>
        <div className="absolute bottom-2 right-2 text-pink-200 text-4xl select-none opacity-40">🕵️‍♀️</div>
        
        <p className="text-xs font-extrabold text-[#FF69B4] tracking-wider uppercase mb-1">FIND THE CORRECT EMOJI FOR 🔍</p>
        <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase select-all">
          {currentWord?.english}
        </h3>
        <p className="text-xs text-[#FF69B4] mt-2">提示：看表情與下面的中文對應 📣</p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCurrentAnswerCorrect = option.id === currentWord.id;

          let btnClass = "bg-white border-3 border-[#FFB6C1] hover:border-[#FF69B4] hover:bg-[#FFF5F7]";
          if (selectedAnswer !== null) {
            if (isSelected) {
              btnClass = isCorrect 
                ? "bg-emerald-50 border-3 border-emerald-400 text-emerald-800 scale-95" 
                : "bg-rose-50 border-3 border-rose-400 text-rose-800 scale-95";
            } else if (isCurrentAnswerCorrect) {
              btnClass = "bg-emerald-50 border-3 border-emerald-400 text-emerald-800 animate-pulse";
            } else {
              btnClass = "bg-slate-55 border-3 border-slate-100 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={selectedAnswer !== null}
              className={`p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-md min-h-[140px] relative cursor-pointer ${btnClass}`}
            >
              <span className="text-5xl md:text-6xl mb-2.5 block transform transition group-hover:scale-110">
                {option.emoji}
              </span>
              <span className="text-xs md:text-sm font-black text-[#FF1493] block bg-[#FFF0F5] px-3.5 py-1.5 rounded-full border border-[#FFB6C1] shadow-sm">
                {option.chinese}
              </span>
            </button>
          );
        })}
      </div>

      {/* Success/Wrong Status Banner */}
      <div className="mt-4 h-12 flex items-center justify-center">
        {selectedAnswer !== null && (
          <div className={`text-base font-black px-6 py-1.5 rounded-full border-2 shadow-md ${
            isCorrect 
              ? "bg-emerald-100 border-emerald-300 text-emerald-700 animate-bounce" 
              : "bg-rose-100 border-rose-300 text-rose-700"
          }`}>
            {isCorrect ? "✨ 太棒了！答對囉！ 💖 🎀" : "💡 哎呀！差一點點，再接再厲！ 🌟"}
          </div>
        )}
      </div>
    </div>
  );
}
