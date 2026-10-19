import React, { useState, useEffect } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Star, Trophy, CheckCircle } from "lucide-react";

interface ChMatchMatchProps {
  onBack: () => void;
}

interface TileItem {
  id: string; // word id + type
  wordId: string;
  text: string;
  type: "english" | "chinese";
  emoji?: string;
}

export default function ChMatchMatch({ onBack }: ChMatchMatchProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [pool, setPool] = useState<Word[]>([]);
  const [currentSetWords, setCurrentSetWords] = useState<Word[]>([]);
  const [englishTiles, setEnglishTiles] = useState<TileItem[]>([]);
  const [chineseTiles, setChineseTiles] = useState<TileItem[]>([]);
  
  const [selectedEnglish, setSelectedEnglish] = useState<TileItem | null>(null);
  const [selectedChinese, setSelectedChinese] = useState<TileItem | null>(null);
  const [matchedWordIds, setMatchedWordIds] = useState<string[]>([]);
  
  const [completedSetsCount, setCompletedSetsCount] = useState<number>(0);
  const [totalSetsCount, setTotalSetsCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<"playing" | "game_over">("playing");

  const chapters = CHAPTERS;

  const startGame = (chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    // Shuffle pool
    const shuffledPool = [...filtered].sort(() => Math.random() - 0.5);
    if (shuffledPool.length === 0) return;

    setPool(shuffledPool);
    setCompletedSetsCount(0);
    // Calculated as total words / 5 (capped or floored)
    const totalSets = Math.min(Math.ceil(shuffledPool.length / 5), 10); // max 10 sets to keep it engaging
    setTotalSetsCount(totalSets);
    setScore(0);
    setGameState("playing");
    setGameStarted(true);
    
    loadSet(0, shuffledPool);
  };

  const loadSet = (setIdx: number, currentPool: Word[]) => {
    // Take 5 words for this set
    const sIndex = setIdx * 5;
    let selected = currentPool.slice(sIndex, sIndex + 5);
    
    // In case we are out of words, wrap around or re-shuffle
    if (selected.length < 5 && sIndex > 0) {
      const remainingNeeded = 5 - selected.length;
      const fallbackPool = currentPool.filter(item => !selected.some(s => s.id === item.id));
      selected = [...selected, ...fallbackPool.slice(0, remainingNeeded)];
    }

    // Double check we have at least 1 word
    if (selected.length === 0) {
      setGameState("game_over");
      return;
    }

    setCurrentSetWords(selected);
    setMatchedWordIds([]);
    setSelectedEnglish(null);
    setSelectedChinese(null);

    // Create tiles
    const engs: TileItem[] = selected.map(w => ({
      id: `${w.id}_eng`,
      wordId: w.id,
      text: w.english,
      type: "english" as "english",
      emoji: w.emoji
    })).sort(() => Math.random() - 0.5);

    const chs: TileItem[] = selected.map(w => ({
      id: `${w.id}_ch`,
      wordId: w.id,
      text: w.chinese,
      type: "chinese" as "chinese"
    })).sort(() => Math.random() - 0.5);

    setEnglishTiles(engs);
    setChineseTiles(chs);
  };

  // Handle Match matching logic
  useEffect(() => {
    if (selectedEnglish && selectedChinese) {
      if (selectedEnglish.wordId === selectedChinese.wordId) {
        // Correct match!
        const matchedId = selectedEnglish.wordId;
        playCorrectSound();
        setMatchedWordIds(prev => [...prev, matchedId]);
        setScore(prev => prev + 10);
        
        setSelectedEnglish(null);
        setSelectedChinese(null);
      } else {
        // Wrong match!
        playIncorrectSound();
        const prevEnglish = selectedEnglish;
        const prevChinese = selectedChinese;
        // Keep them selected visually briefly in error state, then reset
        setTimeout(() => {
          setSelectedEnglish(curr => curr?.id === prevEnglish.id ? null : curr);
          setSelectedChinese(curr => curr?.id === prevChinese.id ? null : curr);
        }, 800);
      }
    }
  }, [selectedEnglish, selectedChinese]);

  // Check if all matched
  useEffect(() => {
    if (currentSetWords.length > 0 && matchedWordIds.length === currentSetWords.length) {
      // Completed this set!
      setTimeout(() => {
        const nextSetIdx = completedSetsCount + 1;
        setCompletedSetsCount(nextSetIdx);
        
        if (nextSetIdx < totalSetsCount && (nextSetIdx * 5) < pool.length) {
          loadSet(nextSetIdx, pool);
        } else {
          setGameState("game_over");
        }
      }, 1000);
    }
  }, [matchedWordIds, currentSetWords]);

  const handleTileClick = (item: TileItem) => {
    if (matchedWordIds.includes(item.wordId)) return; // Already matched
    
    if (item.type === "english") {
      // If clicked again, deselect
      if (selectedEnglish?.id === item.id) {
        setSelectedEnglish(null);
      } else {
        setSelectedEnglish(item);
      }
    } else {
      if (selectedChinese?.id === item.id) {
        setSelectedChinese(null);
      } else {
        setSelectedChinese(item);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="w-full bg-[#FFF0F5] p-8 rounded-3xl border-4 border-[#FF69B4] text-center relative max-w-2xl mx-auto shadow-2xl">
        <div className="absolute top-3 left-3 text-3xl">🎀</div>
        <div className="absolute top-3 right-3 text-3xl">🌸</div>
        <h2 className="text-3xl font-black text-[#FF1493] mb-3 flex items-center justify-center gap-2">
          <span>Match Match 中英配對題 🤝</span>
        </h2>
        <p className="text-[#FF69B4] font-bold text-sm mb-6 bg-white py-2 px-4 rounded-full border border-[#FFF0F5] inline-block shadow-sm">
          將英文字與相應的中文意思連在一起！每完成一組5個，即可進入下一組！
        </p>

        <div className="bg-white p-6 rounded-2xl border-3 border-[#FFB6C1] mb-6 shadow-md">
          <label className="block text-[#FF1493] font-black text-base mb-3">
            🎀 請選擇要配對的單詞範圍：
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
            <span>🚀 進入考驗 🎀</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "game_over") {
    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-pink-300 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-100 rounded-full opacity-50"></div>
        
        <Trophy className="w-20 h-20 text-yellow-500 fill-yellow-200 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-pink-600 mb-2">🎉 太棒了！配對王！ 🎉</h2>
        <p className="text-slate-600 font-medium mb-6">
          你成功完成了所有的配對！大腦運作得太靈活了！🧠💡
        </p>

        <div className="bg-pink-50 py-4 px-6 rounded-2xl border-2 border-pink-200 inline-block mb-6 shadow-inner">
          <span className="text-slate-500 text-xs font-bold block mb-1">SCORE 🏆</span>
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
          <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-500" />
          <span>回合: {completedSetsCount + 1} / {totalSetsCount} 組</span>
        </div>

        <div className="bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-black text-emerald-700">
          總分: {score}
        </div>
      </div>

      <div className="text-center mb-6 bg-white/40 p-2.5 rounded-xl border border-pink-100">
        <p className="text-pink-600 font-extrabold text-sm">
          💡 請點點看左邊一個英文，再點點看右邊對應的中文意思！
        </p>
      </div>

      {/* Matching Columns */}
      <div className="grid grid-cols-2 gap-8 md:gap-12 min-h-[350px]">
        {/* Left Column (English words) */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-center text-sm font-black text-rose-500 tracking-wider bg-rose-100/50 py-1 rounded-full border border-rose-200 mb-1">
            🇬🇧 ENGLISH WORDS
          </h4>
          {englishTiles.map((tile) => {
            const isMatched = matchedWordIds.includes(tile.wordId);
            const isSelected = selectedEnglish?.id === tile.id;
            
            let cardStyle = "bg-white border-3 border-pink-100 text-slate-800 hover:bg-pink-50/50 cursor-pointer";
            if (isMatched) {
              cardStyle = "bg-emerald-100 border-3 border-emerald-300 text-emerald-700 opacity-50 cursor-not-allowed transform scale-95";
            } else if (isSelected) {
              // Check if we are currently flashing an incorrect selection
              const isWrongMismatch = selectedChinese !== null && selectedEnglish?.id === tile.id && selectedChinese.wordId !== tile.wordId;
              cardStyle = isWrongMismatch
                ? "bg-rose-100 border-3 border-rose-400 text-rose-800 shake-animation"
                : "bg-pink-400 border-3 border-pink-600 text-white font-extrabold shadow-md scale-105";
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={isMatched}
                className={`py-4 px-4 rounded-2xl text-center flex items-center justify-center gap-2 font-bold text-sm md:text-base transition-all duration-150 select-none ${cardStyle}`}
              >
                <span className="text-xl">{tile.emoji}</span>
                <span className="break-words w-full truncate">{tile.text}</span>
                {isMatched && <span className="text-sm">💖</span>}
              </button>
            );
          })}
        </div>

        {/* Right Column (Chinese translations) */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-center text-sm font-black text-sky-500 tracking-wider bg-sky-100/50 py-1 rounded-full border border-sky-200 mb-1">
            🇨🇳 中文釋義
          </h4>
          {chineseTiles.map((tile) => {
            const isMatched = matchedWordIds.includes(tile.wordId);
            const isSelected = selectedChinese?.id === tile.id;
            
            let cardStyle = "bg-white border-3 border-pink-100 text-slate-800 hover:bg-pink-50/50 cursor-pointer";
            if (isMatched) {
              cardStyle = "bg-emerald-100 border-3 border-emerald-300 text-emerald-700 opacity-50 cursor-not-allowed transform scale-95";
            } else if (isSelected) {
              const isWrongMismatch = selectedEnglish !== null && selectedChinese?.id === tile.id && selectedEnglish.wordId !== tile.wordId;
              cardStyle = isWrongMismatch
                ? "bg-rose-100 border-3 border-rose-400 text-rose-800 shake-animation"
                : "bg-sky-400 border-3 border-sky-600 text-white font-extrabold shadow-md scale-105";
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={isMatched}
                className={`py-4 px-4 rounded-2xl text-center flex items-center justify-center gap-2 font-bold text-sm md:text-base transition-all duration-150 select-none ${cardStyle}`}
              >
                <span className="break-words w-full truncate">{tile.text}</span>
                {isMatched && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish Status Ring */}
      <div className="mt-6 flex justify-center text-center">
        {matchedWordIds.length === 5 && (
          <span className="text-base font-black px-6 py-2 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-700 animate-pulse">
            ✨ 全部答對啦！正在為你載入下一組 🎀 🏃‍♂️
          </span>
        )}
      </div>
    </div>
  );
}
