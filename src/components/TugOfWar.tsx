import React, { useState, useEffect } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound, playTugWinSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Star, Trophy, Users, AlertCircle } from "lucide-react";
import MarioCharacterSprite from "./MarioCharacterSprite";

interface TugOfWarProps {
  onBack: () => void;
  roundsCount?: 5 | 10; // supports 5 or 10 rounds
}

export default function TugOfWar({ onBack, roundsCount = 5 }: TugOfWarProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<Word[]>([]);

  // Scores/Rounds won by each player
  const [playerAScore, setPlayerAScore] = useState<number>(0);
  const [playerBScore, setPlayerBScore] = useState<number>(0);
  
  // Who won the current active round
  const [roundWinner, setRoundWinner] = useState<"A" | "B" | null>(null);
  
  // Stalling states when a player gets one wrong
  const [aWrongCooldown, setAWrongCooldown] = useState<boolean>(false);
  const [bWrongCooldown, setBWrongCooldown] = useState<boolean>(false);
  
  const [gameOver, setGameOver] = useState<boolean>(false);
  
  // Visual position of the rope indicator: neutral is 0, ranges from -5 to +5
  const [ropeOffset, setRopeOffset] = useState<number>(0);

  const chapters = CHAPTERS;

  const startGame = (chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    // Shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    if (shuffled.length === 0) return;

    const gameQuestions = shuffled.slice(0, roundsCount);

    setQuestions(gameQuestions);
    setCurrentIndex(0);
    setPlayerAScore(0);
    setPlayerBScore(0);
    setRoundWinner(null);
    setAWrongCooldown(false);
    setBWrongCooldown(false);
    setRopeOffset(0);
    setGameOver(false);
    setGameStarted(true);

    generateOptions(gameQuestions[0], filtered);
  };

  const generateOptions = (currentWord: Word, pool: Word[]) => {
    const distractors = pool.filter(w => w.id !== currentWord.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffledDistractors.slice(0, 3);
    const finalOptions = [currentWord, ...selectedDistractors].sort(() => Math.random() - 0.5);
    setOptions(finalOptions);
  };

  // Player A responds
  const handlePlayerAAnswer = (wordId: string) => {
    if (roundWinner !== null || aWrongCooldown) return;
    const currentWord = questions[currentIndex];

    if (wordId === currentWord.id) {
      // Player A wins this question!
      setRoundWinner("A");
      setPlayerAScore(prev => prev + 1);
      setRopeOffset(prev => Math.max(prev - 2, -5)); // pull left
      playTugWinSound();

      // Proceed to next question after short delay
      setTimeout(() => {
        advanceRound();
      }, 1500);
    } else {
      // Player A chose wrong, penalize A with short cooldown
      playIncorrectSound();
      setAWrongCooldown(true);
      setTimeout(() => setAWrongCooldown(false), 1200);
    }
  };

  // Player B responds
  const handlePlayerBAnswer = (wordId: string) => {
    if (roundWinner !== null || bWrongCooldown) return;
    const currentWord = questions[currentIndex];

    if (wordId === currentWord.id) {
      // Player B wins this question!
      setRoundWinner("B");
      setPlayerBScore(prev => prev + 1);
      setRopeOffset(prev => Math.min(prev + 2, 5)); // pull right
      playTugWinSound();

      // Proceed to next question after short delay
      setTimeout(() => {
        advanceRound();
      }, 1500);
    } else {
      // Player B chose wrong, penalize B with short cooldown
      playIncorrectSound();
      setBWrongCooldown(true);
      setTimeout(() => setBWrongCooldown(false), 1200);
    }
  };

  const advanceRound = () => {
    setRoundWinner(null);
    setAWrongCooldown(false);
    setBWrongCooldown(false);

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      let filteredPool = WORD_LIST.filter(w => selectedChapter === "All" || w.chapter === selectedChapter);
      generateOptions(questions[nextIndex], filteredPool);
    } else {
      setGameOver(true);
    }
  };

  if (!gameStarted) {
    return (
      <div className="w-full bg-pink-50/50 p-6 rounded-3xl border-4 border-pink-200 text-center relative max-w-2xl mx-auto shadow-md">
        <div className="absolute top-2 left-2 text-3xl">🎀</div>
        <div className="absolute top-2 right-2 text-3xl">🪢</div>
        
        <h2 className="text-3xl font-extrabold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <span>{roundsCount}題組 🪢 雙人同步拔河賽</span>
        </h2>
        
        <p className="text-pink-500 font-medium text-sm mb-6 leading-relaxed">
          雙人線下對戰！看中間顯示的中文內容，快速在自己那一邊找出正確的英文單詞並點擊！
          <br /> ⭐ 拔河規則：如果對方先答對了，你就不能做囉，直接進入下一題並算他得分！
        </p>

        <div className="bg-white/80 p-6 rounded-2xl border-2 border-pink-100 mb-6 shadow-sm">
          <label className="block text-pink-700 font-extrabold text-base mb-3">
            🎀 請選擇拔河挑戰的單詞範圍：
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
            <Users className="w-5 h-5" />
            <span>開始拔河 🎀</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const finalWinner = playerAScore > playerBScore ? "A" : playerBScore > playerAScore ? "B" : "TIE";

    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-pink-300 text-center max-w-2xl mx-auto shadow-xl relative overflow-hidden">
        <Trophy className="w-20 h-20 text-yellow-400 fill-yellow-105 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-pink-600 mb-2">🎉 拔河比賽圓滿結束！ 🎉</h2>
        
        <div className="my-6 p-6 rounded-3xl border-3 border-pink-100 bg-pink-50/50">
          {finalWinner === "TIE" ? (
            <p className="text-2xl font-black text-slate-700">🙀 兩位同學平手囉！大家都超厲害！ 🌸</p>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-pink-400">WINNER 🏆</span>
              <span className="text-4xl font-extrabold text-pink-600 mb-2">
                🎉 {finalWinner === "A" ? "👈 左邊同學 (Player A)" : "👉 右邊同學 (Player B)"} 獲勝！
              </span>
              <span className="text-sm font-medium text-slate-600">
                得分比：{playerAScore} 比 {playerBScore}
              </span>
            </div>
          )}
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

  // Visual helper mapping offset to CSS pixels
  // neutral (0) is centered. Negative pulls left, positive pulls right.
  const ropeLeftPercentage = 50 + ropeOffset * 8; // -5 would be 10%, +5 would be 90%

  return (
    <div className="w-full max-w-6xl mx-auto bg-pink-50/20 p-6 rounded-3xl border-4 border-pink-200 shadow-xl relative overflow-hidden">
      
      {/* Middle Tug-of-war Rope Arena (Fixed position above the buttons) */}
      <div className="bg-white p-5 rounded-2xl border-3 border-pink-100 shadow-sm mb-6 flex flex-col items-center relative overflow-hidden">
        
        {/* HUD Stats */}
        <div className="flex justify-between items-center w-full mb-3 select-none">
          <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-black">
            👈 Player A: {playerAScore} 分
          </div>
          <div className="bg-slate-100 text-slate-600 px-3.5 py-1 rounded-full text-xs font-extrabold border border-slate-200">
            回合: {currentIndex + 1} / {questions.length}
          </div>
          <div className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-xs font-black">
            Player B: {playerBScore} 分 👉
          </div>
        </div>

        {/* The Target Question */}
        <div className="text-center mb-4 z-10">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mb-1">TARGET CHINESE MEANING 🇨🇳</span>
          <h3 className="text-3xl font-black text-slate-800 break-normal select-none">
            {currentWord?.emoji} {currentWord?.chinese}
          </h3>
        </div>

        {/* The Rope with Animated pulling characters */}
        <div className="w-full relative h-24 flex items-end bg-[#5C94FC] rounded-2xl p-2 border-3 border-black shadow-inner overflow-hidden">
          {/* Ground surface */}
          <div className="absolute bottom-0 inset-x-0 w-full h-4 bg-[#00A24A] border-t border-black"></div>

          {/* Background cute cloud decorations */}
          <div className="absolute top-2 left-6 bg-white/20 w-8 h-2.5 rounded-full select-none"></div>
          <div className="absolute top-4 right-12 bg-white/20 w-12 h-3.5 rounded-full select-none"></div>

          {/* Main Rope Line */}
          <div className="absolute left-6 right-6 bottom-5 h-2 bg-amber-800 border-y border-black z-0 shadow"></div>
          
          {/* Central Neutral Marker */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-1.5 h-6 bg-red-500 border border-black z-0"></div>

          {/* Player A (Mario) Pulling at left of Ribbon */}
          <div 
            className="absolute -translate-x-1/2 transition-all duration-300 ease-out z-10"
            style={{ 
              left: `calc(${ropeLeftPercentage}% - 34px)`,
              bottom: "8px" 
            }}
          >
            <MarioCharacterSprite 
              character="mario" 
              animation={roundWinner === "A" ? "win" : roundWinner === "B" ? "idle" : "pulling"} 
              size={36} 
            />
            {/* Tag label */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black text-rose-600 bg-white border border-black rounded px-1 leading-none shadow-sm select-none">
              P1
            </span>
          </div>

          {/* Rope pulling ribbon node */}
          <div 
            className="absolute -translate-x-1/2 transition-all duration-300 ease-out flex flex-col items-center justify-center z-10"
            style={{ left: `${ropeLeftPercentage}%`, bottom: "14px" }}
          >
            <span className="text-xl leading-none filter drop-shadow">🎀</span>
          </div>

          {/* Player B (Luigi) Pulling at right of Ribbon */}
          <div 
            className="absolute -translate-x-1/2 transition-all duration-300 ease-out z-10 flex flex-col items-center"
            style={{ 
              left: `calc(${ropeLeftPercentage}% + 34px)`,
              bottom: "8px"
            }}
          >
            {/* Horizontal flip to face Mario! */}
            <div className="scale-x-[-1]">
              <MarioCharacterSprite 
                character="luigi" 
                animation={roundWinner === "B" ? "win" : roundWinner === "A" ? "idle" : "pulling"} 
                size={36} 
              />
            </div>
            {/* Tag label */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black text-sky-600 bg-white border border-black rounded px-1 leading-none shadow-sm select-none">
              P2
            </span>
          </div>
        </div>

        {/* Temporary Round status info */}
        <div className="mt-2 h-7 flex items-center justify-center overflow-hidden">
          {roundWinner && (
            <span className={`text-xs font-black px-4 py-1 rounded-full border ${
              roundWinner === "A" 
                ? "bg-pink-100 border-pink-300 text-pink-700 animate-bounce" 
                : "bg-sky-100 border-sky-300 text-sky-700 animate-bounce"
            }`}>
              {roundWinner === "A" ? "🎉 👈 左邊學生搶先答對！ 🎀" : "🎉 👉 右邊學生搶先答對！ 🎀"}
            </span>
          )}
        </div>
      </div>

      {/* Synchronous Split Options Layout */}
      <div className="grid grid-cols-2 gap-10 md:gap-14 relative">
        <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-1.5 bg-pink-100 border-r border-dashed border-pink-200"></div>

        {/* Left Side Panel: Player A Area (Pink Style) */}
        <div className={`p-4 rounded-2xl border-4 flex flex-col gap-4 shadow-sm relative ${
          aWrongCooldown ? "border-rose-450 bg-rose-50" : "border-pink-200 bg-white"
        }`}>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm font-black text-pink-600">👈 PLAYER A區域</span>
            {aWrongCooldown && (
              <span className="text-[10px] text-rose-500 font-bold bg-rose-100 px-2 py-0.5 rounded animate-pulse">
                答錯罰秒! ⏳
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {options.map((item) => (
              <button
                key={`${item.id}_a`}
                onClick={() => handlePlayerAAnswer(item.id)}
                disabled={roundWinner !== null || aWrongCooldown}
                className="py-4 px-4 bg-pink-50 border-3 border-pink-100 hover:border-pink-350 hover:bg-pink-100/50 text-pink-850 font-bold text-sm md:text-base rounded-2xl shadow-sm text-center transition-all duration-150 active:scale-98 select-none disabled:opacity-50 cursor-pointer text-wrap"
              >
                {item.english}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Panel: Player B Area (Blue Style) */}
        <div className={`p-4 rounded-2xl border-4 flex flex-col gap-4 shadow-sm relative ${
          bWrongCooldown ? "border-sky-400 bg-sky-50" : "border-sky-200 bg-white"
        }`}>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm font-black text-sky-600">PLAYER B區域 👉</span>
            {bWrongCooldown && (
              <span className="text-[10px] text-rose-500 font-bold bg-rose-100 px-2 py-0.5 rounded animate-pulse">
                答錯罰秒! ⏳
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {options.map((item) => (
              <button
                key={`${item.id}_b`}
                onClick={() => handlePlayerBAnswer(item.id)}
                disabled={roundWinner !== null || bWrongCooldown}
                className="py-4 px-4 bg-sky-50 border-3 border-sky-150 hover:border-sky-305 hover:bg-sky-100/50 text-sky-850 font-bold text-sm md:text-base rounded-2xl shadow-sm text-center transition-all duration-150 active:scale-98 select-none disabled:opacity-50 cursor-pointer text-wrap"
              >
                {item.english}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center flex justify-center">
        <button
          onClick={() => setGameStarted(false)}
          className="px-5 py-2.5 bg-slate-400 border-b-4 border-slate-600 text-white font-bold text-xs rounded-full hover:bg-slate-500 transition cursor-pointer"
        >
          放棄這場，重選範圍
        </button>
      </div>
    </div>
  );
}
