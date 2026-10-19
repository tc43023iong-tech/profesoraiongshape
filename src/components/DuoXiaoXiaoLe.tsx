import React, { useState } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { RefreshCw, Trophy, ArrowLeft, Zap } from "lucide-react";

interface DuoXiaoXiaoLeProps {
  onBack: () => void;
}

interface CardItem {
  id: string; // e.g. wordId_en or wordId_ch
  wordId: string;
  text: string;
  type: "english" | "chinese";
  emoji?: string;
  isEliminated: boolean;
}

export default function DuoXiaoXiaoLe({ onBack }: DuoXiaoXiaoLeProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  // Independent cards boards for P1 (Mario) and P2 (Luigi)
  const [cardsA, setCardsA] = useState<CardItem[]>([]);
  const [cardsB, setCardsB] = useState<CardItem[]>([]);
  
  // Scoring
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  
  // Selections
  const [selectedA, setSelectedA] = useState<CardItem | null>(null);
  const [selectedB, setSelectedB] = useState<CardItem | null>(null);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<string>("");

  const chapters = CHAPTERS;

  const startGame = (chapter: string) => {
    setScoreA(0);
    setScoreB(0);
    setSelectedA(null);
    setSelectedB(null);
    setGameOver(false);
    setWinnerName("");
    setGameStarted(true);
    generateBoards(chapter);
  };

  const generateBoards = (chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    if (filtered.length < 6) {
      filtered = WORD_LIST;
    }

    // Shuffle and pick 6 words to make a 12-card board (6 English, 6 Chinese) for each player
    const pool = [...filtered].sort(() => Math.random() - 0.5);
    const chosenA = pool.slice(0, 6);
    // Shuffle pool again for board B so they don't get the same layouts
    const chosenB = [...filtered].sort(() => Math.random() - 0.5).slice(0, 6);

    const makeCards = (chosenWords: Word[], playerSfx: "A" | "B") => {
      const items: CardItem[] = [];
      chosenWords.forEach((word) => {
        items.push({
          id: `${word.id}_en_${playerSfx}`,
          wordId: word.id,
          text: word.english,
          type: "english",
          emoji: word.emoji,
          isEliminated: false
        });
        items.push({
          id: `${word.id}_ch_${playerSfx}`,
          wordId: word.id,
          text: word.chinese,
          type: "chinese",
          isEliminated: false
        });
      });
      return items.sort(() => Math.random() - 0.5);
    };

    setCardsA(makeCards(chosenA, "A"));
    setCardsB(makeCards(chosenB, "B"));
  };

  // Click handler for Player A (Mario Grid)
  const handleCardClickA = (card: CardItem) => {
    if (card.isEliminated) return;

    if (selectedA === null) {
      setSelectedA(card);
    } else {
      if (selectedA.id === card.id) {
        setSelectedA(null); // Deselect
        return;
      }

      // If matching pair (same wordId but different type)
      if (selectedA.wordId === card.wordId && selectedA.type !== card.type) {
        playCorrectSound();
        setScoreA((prev) => prev + 10);
        
        const updated = cardsA.map((c) => {
          if (c.id === selectedA.id || c.id === card.id) {
            return { ...c, isEliminated: true };
          }
          return c;
        });
        setCardsA(updated);
        setSelectedA(null);

        // Check if board A cleared
        const allCleared = updated.every((c) => c.isEliminated);
        if (allCleared) {
          // Player A cleared first!
          setWinnerName("🔴 瑪利歐 (P1) 率先通關板塊！");
          setTimeout(() => setGameOver(true), 1200);
        }
      } else {
        playIncorrectSound();
        setSelectedA(card); // Switch selector
      }
    }
  };

  // Click handler for Player B (Luigi Grid)
  const handleCardClickB = (card: CardItem) => {
    if (card.isEliminated) return;

    if (selectedB === null) {
      setSelectedB(card);
    } else {
      if (selectedB.id === card.id) {
        setSelectedB(null); // Deselect
        return;
      }

      // If matching pair (same wordId but different type)
      if (selectedB.wordId === card.wordId && selectedB.type !== card.type) {
        playCorrectSound();
        setScoreB((prev) => prev + 10);
        
        const updated = cardsB.map((c) => {
          if (c.id === selectedB.id || c.id === card.id) {
            return { ...c, isEliminated: true };
          }
          return c;
        });
        setCardsB(updated);
        setSelectedB(null);

        // Check if board B cleared
        const allCleared = updated.every((c) => c.isEliminated);
        if (allCleared) {
          // Player B cleared first!
          setWinnerName("🟢 路易吉 (P2) 率先通關板塊！");
          setTimeout(() => setGameOver(true), 1200);
        }
      } else {
        playIncorrectSound();
        setSelectedB(card); // Switch selector
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="w-full bg-[#FFF8E7] p-8 rounded-3xl border-4 border-black text-center relative max-w-2xl mx-auto shadow-[6px_6px_0px_#000000]">
        <div className="absolute top-3 left-3 text-3xl animate-spin">🧱</div>
        <div className="absolute top-3 right-3 text-3xl animate-bounce">🦖</div>
        
        <h2 className="text-3xl font-black text-[#00A24A] mb-2 flex items-center justify-center gap-2" style={{ textShadow: "1.5px 1.5px 0px #000" }}>
          <span>🧱 Duo Match 雙人分屏消消樂</span>
        </h2>
        
        <p className="text-stone-700 font-bold text-sm mb-6 leading-relaxed bg-white/70 p-4 rounded-xl border-2 border-black inline-block mt-2">
          🍄 專為雙人對戰全新設計！
          <br />學生在同屏中擁有<span className="text-[#E52521] font-black"> 兩組各自獨立 </span>的消消樂版面（12個卡片）。
          <br />🔴 P1 專屬紅隊版面，🟢 P2 專屬綠隊版面！
          <br />雙方各自點按配對自己面前的中英單詞，看誰能最快全部消除！
        </p>

        <div className="bg-white p-6 rounded-2xl border-4 border-black mb-6 shadow-[4px_4px_0px_#000000]">
          <label className="block text-[#E52521] font-black text-base mb-3">
            🎯 請選擇消消樂單詞範圍：
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {chapters.map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-4 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition-all cursor-pointer ${
                  selectedChapter === ch
                    ? "bg-[#FED42C] border-black text-black scale-105 shadow-[2px_2px_0px_#000000]"
                    : "bg-white hover:bg-stone-50 border-stone-300 text-stone-750"
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
            className="mario-btn mario-btn-gray px-6 py-3 cursor-pointer text-sm"
          >
            返回選單
          </button>
          <button
            onClick={() => startGame(selectedChapter)}
            className="mario-btn mario-btn-red px-8 py-3 text-sm cursor-pointer"
          >
            <span>🚀 搭建分屏戰場 🧱</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-black text-center max-w-xl mx-auto shadow-[6px_6px_0px_#000] relative overflow-hidden">
        <Trophy className="w-20 h-20 text-yellow-400 fill-yellow-200 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-[#E52521] mb-2" style={{ textShadow: "1px 1px 0px #000" }}>🎉 雙人消消樂對決結束！ 🎉</h2>
        
        <div className="bg-[#FFF8E7] border-4 border-black p-6 rounded-3xl my-6">
          <p className="text-xs font-black text-stone-500 uppercase tracking-widest font-pixel">🏆 DUEL RESULT 🏆</p>
          <h3 className="text-2xl font-black text-stone-900 mt-2 mb-3">
            {winnerName || "精彩的對抗！"}
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm font-black border-t-2 border-black/10 pt-4">
            <div className="text-[#E52521]">
              🔴 瑪利歐 (P1): {scoreA} 分
              <p className="text-[10px] text-stone-400">消除 {scoreA / 10} 組</p>
            </div>
            <div className="text-[#00A24A]">
              🟢 路易吉 (P2): {scoreB} 分
              <p className="text-[10px] text-stone-400">消除 {scoreB / 10} 組</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setGameStarted(false)}
            className="mario-btn mario-btn-yellow text-stone-900 px-6 py-2.5 text-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 inline-block mr-1" />
            <span>重新選題</span>
          </button>
          <button
            onClick={onBack}
            className="mario-btn mario-btn-red text-white px-6 py-2.5 text-xs cursor-pointer"
          >
            🏠 返回城堡大廳
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000000] relative">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center mb-6 bg-[#FFF8E7] p-3 rounded-2xl border-3 border-black shadow-inner">
        <button
          onClick={() => setGameStarted(false)}
          className="px-4 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-black text-stone-700 hover:bg-stone-50 flex items-center gap-1 cursor-pointer transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>重新選擇題目</span>
        </button>

        <h3 className="text-sm md:text-base font-black text-stone-900 tracking-wider flex items-center gap-1 font-pixel">
          <span>🧱 DUEL MATCHING SPLIT-BOARD 🧱</span>
        </h3>

        <div className="text-stone-500 font-bold text-xs uppercase tracking-tight flex items-center gap-1">
          <Zap className="w-4 h-4 text-yellow-500 animate-bounce" />
          <span>比拼消除速度！</span>
        </div>
      </div>

      {/* Two split panels side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PLAYER A PANEL (MARIO RED) */}
        <div className="bg-[#FFFEEF] border-4 border-[#E52521] p-5 rounded-2xl shadow-[4px_4px_0px_#E52521]">
          <div className="flex justify-between items-center pb-3 mb-4 border-b-3 border-black">
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-bounce">🔴</span>
              <div>
                <h4 className="text-sm font-black text-[#E52521]">PLAYER 1 (瑪利歐)</h4>
                <p className="text-[10px] text-stone-500">紅隊消消樂板塊</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#E52521]">{scoreA} <span className="text-xs">PTS</span></span>
            </div>
          </div>

          {/* Current Selection state */}
          <div className="mb-3 bg-white p-2 rounded-lg border-2 border-dashed border-stone-300 text-center text-xs font-bold text-stone-700">
            當前選取卡片: <span className="text-[#E52521] font-black">{selectedA ? selectedA.text : "尚未點擊"}</span>
          </div>

          {/* Cards board Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-stone-100 p-3 rounded-xl border-3 border-black">
            {cardsA.map((card) => {
              const isEliminated = card.isEliminated;
              const isSelected = selectedA?.id === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClickA(card)}
                  className={`aspect-square p-2 rounded-xl flex flex-col justify-center items-center text-center select-none cursor-pointer transition-all border-3 ${
                    isEliminated
                      ? "bg-transparent border-dashed border-stone-300 text-stone-300 opacity-20 scale-75 pointer-events-none"
                      : isSelected
                      ? "bg-[#FED42C] border-black text-black scale-102 shadow-[2px_2px_0px_#000] rotate-2"
                      : "bg-white hover:bg-red-50 border-[#E52521] text-stone-850 hover:scale-102 active:scale-95"
                  }`}
                >
                  {!isEliminated && (
                    <>
                      {card.emoji && <span className="text-2xl mb-1">{card.emoji}</span>}
                      <span className="font-extrabold text-[10px] sm:text-xs tracking-tight break-words leading-tight w-full pointer-events-none">
                        {card.text}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PLAYER B PANEL (LUIGI GREEN) */}
        <div className="bg-[#FFFEEF] border-4 border-[#00A24A] p-5 rounded-2xl shadow-[4px_4px_0px_#00024A]">
          <div className="flex justify-between items-center pb-3 mb-4 border-b-3 border-black">
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-bounce">🟢</span>
              <div>
                <h4 className="text-sm font-black text-[#00A24A]">PLAYER 2 (路易吉)</h4>
                <p className="text-[10px] text-stone-500">綠隊消消樂板塊</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#00A24A]">{scoreB} <span className="text-xs">PTS</span></span>
            </div>
          </div>

          {/* Current Selection state */}
          <div className="mb-3 bg-white p-2 rounded-lg border-2 border-dashed border-stone-300 text-center text-xs font-bold text-stone-700">
            當前選取卡片: <span className="text-[#00A24A] font-black">{selectedB ? selectedB.text : "尚未點擊"}</span>
          </div>

          {/* Cards board Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-stone-100 p-3 rounded-xl border-3 border-black">
            {cardsB.map((card) => {
              const isEliminated = card.isEliminated;
              const isSelected = selectedB?.id === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClickB(card)}
                  className={`aspect-square p-2 rounded-xl flex flex-col justify-center items-center text-center select-none cursor-pointer transition-all border-3 ${
                    isEliminated
                      ? "bg-transparent border-dashed border-stone-300 text-stone-300 opacity-20 scale-75 pointer-events-none"
                      : isSelected
                      ? "bg-[#FED42C] border-black text-black scale-102 shadow-[2px_2px_0px_#000] -rotate-2"
                      : "bg-white hover:bg-green-50 border-[#00A24A] text-stone-850 hover:scale-102 active:scale-95"
                  }`}
                >
                  {!isEliminated && (
                    <>
                      {card.emoji && <span className="text-2xl mb-1">{card.emoji}</span>}
                      <span className="font-extrabold text-[10px] sm:text-xs tracking-tight break-words leading-tight w-full pointer-events-none">
                        {card.text}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="mt-8 text-center border-t-4 border-black pt-5">
        <button
          onClick={onBack}
          className="mario-btn mario-btn-red px-6 py-2.5 text-xs inline-flex items-center gap-1 cursor-pointer"
        >
          <span>離開遊戲，返回大廳</span>
        </button>
      </div>

    </div>
  );
}
