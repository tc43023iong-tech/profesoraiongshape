import React, { useState, useEffect, useRef } from "react";
import { Word, WORD_LIST } from "../data";
import { playCorrectSound, playBuzzerSound, playComboSound, speakPortuguese } from "../utils/sound";
import { ArrowLeft, RefreshCw, Trophy, Zap, Heart, Sparkles, Volume2, ShieldAlert } from "lucide-react";

interface FormaFactoryProps {
  onBack: () => void;
}

interface SorterDoor {
  id: "redondo" | "redonda" | "quadrado" | "quadrada" | "retangular";
  label: string;
  sub: string;
  gender: "m" | "f" | "both";
  colorClass: string;
  borderClass: string;
  shadowClass: string;
  icon: string;
}

const DOORS: SorterDoor[] = [
  {
    id: "redondo",
    label: "Redondo",
    sub: "陽性 -o 🔵",
    gender: "m",
    colorClass: "bg-blue-500 hover:bg-blue-600 text-white",
    borderClass: "border-blue-900",
    shadowClass: "shadow-[4px_4px_0px_#1e3a8a]",
    icon: "🔵"
  },
  {
    id: "redonda",
    label: "Redonda",
    sub: "陰性 -a 🌸",
    gender: "f",
    colorClass: "bg-pink-500 hover:bg-pink-600 text-white",
    borderClass: "border-pink-900",
    shadowClass: "shadow-[4px_4px_0px_#831843]",
    icon: "🌸"
  },
  {
    id: "quadrado",
    label: "Quadrado",
    sub: "陽性 -o 🟢",
    gender: "m",
    colorClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    borderClass: "border-emerald-950",
    shadowClass: "shadow-[4px_4px_0px_#064e3b]",
    icon: "🟩"
  },
  {
    id: "quadrada",
    label: "Quadrada",
    sub: "陰性 -a 🌿",
    gender: "f",
    colorClass: "bg-teal-500 hover:bg-teal-600 text-white",
    borderClass: "border-teal-950",
    shadowClass: "shadow-[4px_4px_0px_#134e4a]",
    icon: "🌿"
  },
  {
    id: "retangular",
    label: "Retangular",
    sub: "變形超人 ⭐ 陰陽同形",
    gender: "both",
    colorClass: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-amber-950 font-black",
    borderClass: "border-amber-700 ring-4 ring-yellow-300 ring-offset-2 animate-pulse",
    shadowClass: "shadow-[6px_6px_0px_#78350f]",
    icon: "⭐"
  }
];

export default function FormaFactory({ onBack }: FormaFactoryProps) {
  // Pool of sorting items (excluding standalone adjective cards)
  const itemPool = useRef<Word[]>(WORD_LIST.filter(w => w.article !== ""));

  const [currentItem, setCurrentItem] = useState<Word>(itemPool.current[0]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isFestaMode, setIsFestaMode] = useState<boolean>(false);
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Animation states
  const [conveyorProgress, setConveyorProgress] = useState<number>(10); // 10% to 90%
  const [transformerEffect, setTransformerEffect] = useState<boolean>(false);
  const [errorFeedback, setErrorFeedback] = useState<{
    show: boolean;
    itemName: string;
    chosen: string;
    correct: string;
    ruleExplanation: string;
  } | null>(null);

  const speedRef = useRef<number>(200); // interval tick in ms
  const progressTimerRef = useRef<any>(null);

  // Start new round
  const startNewItem = (isParty: boolean) => {
    if (isParty) {
      // In party mode: coins appear often!
      const coinItem = itemPool.current.find(w => w.id === "circ_f_3") || itemPool.current[0];
      setCurrentItem(coinItem);
    } else {
      const randomIdx = Math.floor(Math.random() * itemPool.current.length);
      setCurrentItem(itemPool.current[randomIdx]);
    }
    setConveyorProgress(15);
  };

  const handleStartGame = () => {
    setScore(0);
    setCombo(0);
    setLives(3);
    setIsFestaMode(false);
    setGameOver(false);
    setErrorFeedback(null);
    setTransformerEffect(false);
    setGameStarted(true);
    startNewItem(false);
  };

  // Auto conveyer belt advance
  useEffect(() => {
    if (!gameStarted || gameOver || errorFeedback?.show) return;

    progressTimerRef.current = setInterval(() => {
      setConveyorProgress((prev) => {
        if (prev >= 95) {
          // Time ran out for this item!
          handleMissedItem();
          return 15;
        }
        return prev + 2.5;
      });
    }, speedRef.current);

    return () => clearInterval(progressTimerRef.current);
  }, [gameStarted, gameOver, errorFeedback, currentItem]);

  const handleMissedItem = () => {
    playBuzzerSound();
    setCombo(0);
    setIsFestaMode(false);
    setLives((l) => {
      const nextLives = l - 1;
      if (nextLives <= 0) {
        setGameOver(true);
      }
      return nextLives;
    });

    setErrorFeedback({
      show: true,
      itemName: currentItem.portuguese,
      chosen: "超時未分類",
      correct: currentItem.targetAdj,
      ruleExplanation: `物品掉落了！${currentItem.portuguese} 是 ${currentItem.gender === 'm' ? '陽性 (o)' : '陰性 (a)'}，正確門是【${currentItem.targetAdj}】！`
    });

    setTimeout(() => {
      setErrorFeedback(null);
      if (lives > 1) {
        startNewItem(false);
      }
    }, 1800);
  };

  // User selects a door
  const handleSelectDoor = (doorId: SorterDoor["id"]) => {
    if (gameOver || errorFeedback?.show || !gameStarted) return;

    const correctDoor = currentItem.targetAdj;

    if (doorId === correctDoor) {
      // Correct!
      playCorrectSound();
      speakPortuguese(currentItem.exampleSentence);

      // Check if retangular transformer effect triggered!
      if (doorId === "retangular") {
        setTransformerEffect(true);
        setTimeout(() => setTransformerEffect(false), 1200);
      }

      const points = isFestaMode ? 200 : 100;
      setScore((s) => s + points);

      const nextCombo = combo + 1;
      setCombo(nextCombo);

      // 5 Combo triggers "Festa!"
      if (nextCombo === 5) {
        playComboSound();
        setIsFestaMode(true);
      }

      startNewItem(nextCombo >= 5);
    } else {
      // Wrong door! Buzzer feedback
      playBuzzerSound();
      setCombo(0);
      setIsFestaMode(false);

      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setGameOver(true);
        }
        return next;
      });

      // Pedagogical mistake explanation:
      let reason = "";
      if (currentItem.shape === "rectangle" && doorId !== "retangular") {
        reason = `注意！長方形是「變形超人」，不管定冠詞是 o 還是 a，衣服都不變，必須進【retangular】金色門！`;
      } else if (currentItem.gender === "m" && doorId.endsWith("a")) {
        reason = `定冠詞是「o (${currentItem.portuguese})」，代表【陽性】，詞尾應配合「-o」而非「-a」！`;
      } else if (currentItem.gender === "f" && doorId.endsWith("o")) {
        reason = `定冠詞是「a (${currentItem.portuguese})」，代表【陰性】，詞尾應配合「-a」而非「-o」！`;
      } else {
        reason = `${currentItem.portuguese} 的正確形狀是【${currentItem.targetAdj}】！`;
      }

      setErrorFeedback({
        show: true,
        itemName: currentItem.portuguese,
        chosen: doorId,
        correct: correctDoor,
        ruleExplanation: reason
      });

      setTimeout(() => {
        setErrorFeedback(null);
        if (lives > 1) {
          startNewItem(false);
        }
      }, 2300);
    }
  };

  // Keyboard hotkeys 1 - 5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      if (e.key === "1") handleSelectDoor("redondo");
      if (e.key === "2") handleSelectDoor("redonda");
      if (e.key === "3") handleSelectDoor("quadrado");
      if (e.key === "4") handleSelectDoor("quadrada");
      if (e.key === "5") handleSelectDoor("retangular");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver, currentItem, errorFeedback]);

  return (
    <div className="w-full bg-[#1b2838] text-white p-4 md:p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] relative overflow-hidden font-sans">
      {/* Festa Mode Background Sparkles */}
      {isFestaMode && (
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 via-pink-500/20 to-purple-500/20 pointer-events-none animate-pulse z-0" />
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 relative z-10">
        <button
          onClick={onBack}
          className="mario-btn mario-btn-gray px-4 py-2 text-xs md:text-sm text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回菜單</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black font-pixel text-yellow-400 drop-shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2">
            <span>🏭 FORMA FACTORY 🍔</span>
          </h2>
          <p className="text-xs text-yellow-200 font-bold">
            《形狀工廠吃貨王》• 5門急速分類，遇見 retangular 男生女生都通關！
          </p>
        </div>

        {/* Stats: Score, Combo, Lives */}
        <div className="flex items-center gap-3">
          {/* Combo badge */}
          {combo > 0 && (
            <div className={`px-3 py-1 rounded-xl border-2 border-black font-pixel text-xs flex items-center gap-1 shadow-[2px_2px_0px_#000] ${
              isFestaMode ? "bg-amber-400 text-black animate-bounce font-black" : "bg-purple-600 text-white"
            }`}>
              <Zap className="w-3.5 h-3.5" />
              <span>{isFestaMode ? `🎉 FESTA x${combo}` : `COMBO x${combo}`}</span>
            </div>
          )}

          {/* Lives */}
          <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-xl border-2 border-red-500">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${i < lives ? "text-red-500 fill-red-500 animate-pulse" : "text-gray-600"}`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="bg-amber-500 border-2 border-black px-3 py-1.5 rounded-xl text-black font-pixel text-xs shadow-[2px_2px_0px_#000]">
            🪙 {score}
          </div>
        </div>
      </div>

      {/* Start Game Screen */}
      {!gameStarted && (
        <div className="bg-stone-900/90 border-4 border-yellow-400 rounded-2xl p-6 text-center max-w-xl mx-auto my-8 shadow-[6px_6px_0px_#000] relative z-10">
          <div className="text-6xl mb-3 animate-bounce">🤖📦🍕</div>
          <h3 className="text-2xl font-black text-yellow-300 font-pixel mb-2">
            形狀傳送帶即將開動！
          </h3>
          <p className="text-stone-300 text-sm mb-4 leading-relaxed font-medium">
            輸送帶源源不絕送來生活物品（如 <span className="text-pink-300 font-bold">a pizza 🍕</span>、<span className="text-sky-300 font-bold">o cubo mágico 🎲</span>、<span className="text-yellow-300 font-bold">a régua 📏</span>）！
            <br />
            看清名詞冠詞是 <span className="text-sky-400 font-black">o (陽性 -o)</span> 還是 <span className="text-pink-400 font-black">a (陰性 -a)</span>，滑動或點擊送入正確的門！
            <br />
            <span className="text-amber-400 font-bold block mt-2">
              ⭐ 變形超人秘籍：遇到長方形物品，不論是 o 還是 a，都直衝 retangular 金色大門！
            </span>
          </p>
          <button
            onClick={handleStartGame}
            className="mario-btn mario-btn-yellow px-8 py-3 text-lg font-black tracking-wider cursor-pointer shadow-[4px_4px_0px_#000]"
          >
            🚀 開始質檢闖關！
          </button>
        </div>
      )}

      {/* Main Arcade Arena */}
      {gameStarted && !gameOver && (
        <div className="relative z-10">
          {/* Transformer superpower banner flash */}
          {transformerEffect && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 border-3 border-black text-black px-6 py-2 rounded-2xl shadow-[4px_4px_0px_#000] font-black text-base animate-bounce flex items-center gap-2">
              <span>⚡ 變形超人發威！陰陽同形 RETANGULAR 完全匹配！ ⚡</span>
            </div>
          )}

          {/* Conveyor Belt Zone */}
          <div className="relative w-full h-56 md:h-64 bg-stone-900 border-4 border-black rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-3 mb-6">
            {/* Belt tracks background with moving stripes */}
            <div className="absolute inset-x-0 bottom-4 h-24 bg-stone-800 border-t-4 border-b-4 border-yellow-500/50 flex items-center overflow-hidden">
              <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_20px,#ffb703_20px,#ffb703_40px)]" />
            </div>

            {/* Conveyor Ceiling / Status */}
            <div className="flex items-center justify-between text-xs font-pixel text-stone-400 px-2 relative z-10">
              <span className="text-yellow-400 flex items-center gap-1">
                <span>CONVEYOR SPEED:</span>
                <span className="text-green-400 font-bold">NORMAL</span>
              </span>
              <span className="text-stone-300">
                鍵盤快捷鍵：[1] [2] [3] [4] [5]
              </span>
            </div>

            {/* Dropping/Moving item on conveyor */}
            <div 
              className="absolute transition-all duration-150 ease-linear flex flex-col items-center justify-center z-20 cursor-grab"
              style={{
                top: `${conveyorProgress}%`,
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className={`p-4 rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center transition-all ${
                isFestaMode 
                  ? "bg-gradient-to-tr from-amber-300 to-yellow-100 ring-4 ring-amber-400 animate-pulse scale-110" 
                  : "bg-white"
              }`}>
                <span className="text-5xl md:text-6xl drop-shadow mb-1 animate-bounce">
                  {currentItem.emoji}
                </span>
                
                {/* Word Label with Article highlight */}
                <div className="flex items-center gap-1.5 font-black text-stone-900 text-lg md:text-xl">
                  <span className={`px-2 py-0.5 rounded-lg border-2 border-black text-xs uppercase ${
                    currentItem.gender === "m" 
                      ? "bg-blue-200 text-blue-900" 
                      : "bg-pink-200 text-pink-900"
                  }`}>
                    {currentItem.article ? `${currentItem.article} (${currentItem.gender === 'm' ? '陽性' : '陰性'})` : "名詞"}
                  </span>
                  <span>{currentItem.portuguese}</span>
                </div>

                <div className="text-xs text-stone-600 font-bold mt-0.5">
                  {currentItem.chinese}
                </div>
              </div>

              {/* Progress countdown bar */}
              <div className="w-32 h-2.5 bg-black/60 rounded-full border border-yellow-400 mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ${conveyorProgress > 75 ? "bg-red-500" : "bg-green-400"}`}
                  style={{ width: `${100 - conveyorProgress}%` }}
                />
              </div>
            </div>

            {/* Error Feedback Overlay Modal */}
            {errorFeedback?.show && (
              <div className="absolute inset-0 bg-black/85 z-40 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center border-3 border-black text-3xl font-black mb-2 animate-bounce">
                  ✕
                </div>
                <h4 className="text-xl font-black text-red-400 font-pixel mb-1">
                  BUZZER! 答錯啦！
                </h4>
                
                {/* Suffix correction card */}
                <div className="bg-stone-900 border-3 border-red-500 p-3 rounded-2xl my-2 max-w-md shadow-lg">
                  <div className="text-sm font-bold text-stone-200 mb-1">
                    題目：<span className="text-yellow-300 font-black">{errorFeedback.itemName}</span>
                  </div>
                  <div className="text-xs font-semibold text-red-300">
                    你的選擇：<span className="line-through text-red-400 font-bold">{errorFeedback.chosen}</span>
                    <span className="mx-2 text-white">➔</span>
                    正確形狀：<span className="text-green-400 font-black text-sm bg-green-950 px-2 py-0.5 rounded border border-green-500">{errorFeedback.correct}</span>
                  </div>
                  <p className="text-xs text-yellow-200 mt-2 font-medium">
                    💡 {errorFeedback.ruleExplanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 5 Sorting Doors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DOORS.map((door, index) => (
              <button
                key={door.id}
                onClick={() => handleSelectDoor(door.id)}
                className={`p-3 md:p-4 rounded-2xl border-4 ${door.borderClass} ${door.colorClass} ${door.shadowClass} flex flex-col items-center justify-center transition-all duration-100 cursor-pointer active:translate-y-1 active:shadow-none relative group select-none`}
              >
                {/* Hotkey hint */}
                <span className="absolute top-1.5 left-2 bg-black/40 text-[10px] font-pixel px-1.5 py-0.5 rounded text-white/80">
                  [{index + 1}]
                </span>

                <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">
                  {door.icon}
                </span>
                <span className="text-base md:text-lg font-black tracking-tight leading-none">
                  {door.label}
                </span>
                <span className="text-[11px] font-bold opacity-90 mt-1">
                  {door.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="bg-stone-900/95 border-4 border-red-500 rounded-3xl p-6 md:p-8 text-center max-w-lg mx-auto my-6 shadow-[8px_8px_0px_#000] relative z-20">
          <div className="text-6xl mb-3">🏆</div>
          <h3 className="text-2xl md:text-3xl font-black text-yellow-400 font-pixel mb-2">
            FACTORY REPORT
          </h3>
          <p className="text-stone-300 text-sm mb-4">
            闖關完成！你在形狀工廠中表現出色！
          </p>

          <div className="bg-stone-800 border-2 border-black rounded-2xl p-4 mb-6 flex justify-around">
            <div>
              <div className="text-xs text-stone-400 font-pixel">FINAL SCORE</div>
              <div className="text-2xl font-black text-amber-400 font-pixel mt-1">🪙 {score}</div>
            </div>
            <div>
              <div className="text-xs text-stone-400 font-pixel">MAX COMBO</div>
              <div className="text-2xl font-black text-purple-400 font-pixel mt-1">⚡ x{combo}</div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleStartGame}
              className="mario-btn mario-btn-yellow px-6 py-2.5 text-black font-black flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>再來一局</span>
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
