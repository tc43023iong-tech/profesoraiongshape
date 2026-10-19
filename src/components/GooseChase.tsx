import React, { useState, useEffect, useRef } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Trophy, Sparkles, HelpCircle } from "lucide-react";

interface GooseChaseProps {
  onBack: () => void;
}

interface GooseNode {
  index: number;
  word: Word;
  // Visual wiggle/animation offset to make the duck walk/wobble
  xOffset: number;
  yOffset: number;
  wobbleDir: number;
}

export default function GooseChase({ onBack }: GooseChaseProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [round, setRound] = useState<number>(1);
  const [maxRounds] = useState<number>(8); // 8 questions in a set
  
  // Game state
  const [geese, setGeese] = useState<GooseNode[]>([]);
  const [targetWord, setTargetWord] = useState<Word | null>(null);
  const [promptType, setPromptType] = useState<"en_to_ch" | "ch_to_en">("en_to_ch"); // guess type
  
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  
  // Drag and drop helper state
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const chapters = CHAPTERS;
  const animationsRef = useRef<number | null>(null);

  // Initialize round
  const startChaseGame = (chapter: string) => {
    setScoreA(0);
    setScoreB(0);
    setRound(1);
    setGameOver(false);
    setGameStarted(true);
    loadRound(1, chapter);
  };

  const loadRound = (roundNum: number, chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    if (filtered.length < 9) {
      filtered = WORD_LIST; // backup
    }

    // Pick 9 unique random words to fill the 3x3 grid
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected9 = shuffled.slice(0, 9);

    // Pick 1 target among these 9
    const targetIdx = Math.floor(Math.random() * 9);
    const target = selected9[targetIdx];
    setTargetWord(target);

    // Randomize whether target prompt is Chinese or English
    // "題目是你給中文，我就找英文，你給英文，我就找中文"
    setPromptType(Math.random() > 0.5 ? "en_to_ch" : "ch_to_en");

    // Initialize 9 geese nodes placed in a 3x3 grid
    const initialGeese: GooseNode[] = selected9.map((word, idx) => ({
      index: idx,
      word,
      xOffset: 0,
      yOffset: 0,
      wobbleDir: Math.random() > 0.5 ? 1 : -1
    }));
    setGeese(initialGeese);
  };

  // Goose waddle walk animation effect: "鴨子走來走去"
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const animateGeese = () => {
      setGeese((prevGeese) =>
        prevGeese.map((g) => {
          // slight float walking around -3 to +3 pixels
          let nextX = g.xOffset + g.wobbleDir * 0.15;
          let nextY = g.yOffset + (Math.random() - 0.5) * 0.2;
          let nextDir = g.wobbleDir;

          if (Math.abs(nextX) > 12) {
            nextDir = -nextDir;
            nextX = Math.sign(nextX) * 11.5;
          }

          return {
            ...g,
            xOffset: nextX,
            yOffset: nextY,
            wobbleDir: nextDir
          };
        })
      );
      animationsRef.current = requestAnimationFrame(animateGeese);
    };

    animationsRef.current = requestAnimationFrame(animateGeese);

    return () => {
      if (animationsRef.current) cancelAnimationFrame(animationsRef.current);
    };
  }, [gameStarted, gameOver]);

  // Handle Drag / Drop pointer tracking
  const handlePointerDown = (e: React.PointerEvent, nodeIndex: number) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // store offset of where user clicked on the card relative to its top-left
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggingNodeId(nodeIndex);
    setDragPos({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingNodeId === null) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingNodeId === null) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Calculate drop area based on window width splits
    // Left 28% of screen -> Basket A
    // Right 28% of screen -> Basket B
    const screenWidth = window.innerWidth;
    const dropX = e.clientX;

    const droppedInBasketA = dropX < screenWidth * 0.32;
    const droppedInBasketB = dropX > screenWidth * 0.68;

    const droppedGoose = geese.find(g => g.index === draggingNodeId);
    
    setDraggingNodeId(null);

    if (!droppedGoose || !targetWord) return;

    if (droppedInBasketA) {
      // Checked if correct goose
      if (droppedGoose.word.id === targetWord.id) {
        setScoreA((prev) => prev + 10);
        playCorrectSound();
        advanceRound();
      } else {
        playIncorrectSound();
      }
    } else if (droppedInBasketB) {
      // Checked if correct goose
      if (droppedGoose.word.id === targetWord.id) {
        setScoreB((prev) => prev + 10);
        playCorrectSound();
        advanceRound();
      } else {
        playIncorrectSound();
      }
    }
  };

  const advanceRound = () => {
    if (round < maxRounds) {
      const nextRound = round + 1;
      setRound(nextRound);
      loadRound(nextRound, selectedChapter);
    } else {
      setGameOver(true);
    }
  };

  // Alternative classroom tap button submit for non-mouse board compatibility
  const handleTapSubmitGoose = (node: GooseNode, team: "A" | "B") => {
    if (!targetWord) return;
    if (node.word.id === targetWord.id) {
      if (team === "A") setScoreA(prev => prev + 10);
      else setScoreB(prev => prev + 10);
      playCorrectSound();
      advanceRound();
    } else {
      playIncorrectSound();
    }
  };

  if (!gameStarted) {
    return (
      <div className="w-full bg-pink-50/50 p-6 rounded-3xl border-4 border-pink-200 text-center relative max-w-2xl mx-auto shadow-md">
        <div className="absolute top-2 left-2 text-3xl">🦢</div>
        <div className="absolute top-2 right-2 text-3xl">🧺</div>
        
        <h2 className="text-3xl font-extrabold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <span>Goose Chase 大白鵝PK 🦢</span>
        </h2>
        
        <p className="text-pink-500 font-medium text-sm mb-6 leading-relaxed">
          雙人互動拖拽對賽！中間放有 9 隻<b>不重複</b>且會<b>走來走去</b>的大白鵝！
          <br /> 看頂部的題目，快速把合適的白鵝拖到自己隊伍的大提籃裡面！
          <br /> 題目給中文找英文，或是給英文找中文。拖對的人加 10 分！
        </p>

        <div className="bg-white/80 p-6 rounded-2xl border-2 border-pink-100 mb-6 shadow-sm">
          <label className="block text-pink-700 font-extrabold text-base mb-3">
            🎀 請選擇要抓捕的大白鵝範圍：
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
            onClick={() => startChaseGame(selectedChapter)}
            className="px-8 py-3 bg-pink-500 border-b-4 border-pink-700 hover:bg-pink-600 font-extrabold text-white text-lg rounded-full transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>🚀 抓大白鵝 🦢</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const winner = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "TIE";

    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-pink-300 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
        <Trophy className="w-20 h-20 text-yellow-400 fill-yellow-205 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-pink-600 mb-2">🎉 卡通大白鵝對決結束！ 🎉</h2>
        
        <div className="bg-pink-50/50 border-3 border-pink-200 p-6 rounded-3xl my-6">
          {winner === "TIE" ? (
            <p className="text-xl font-bold text-slate-800">😻 兩隊平局！大家都好厲害！ 🦢</p>
          ) : (
            <div>
              <p className="text-xs font-semibold text-pink-450 uppercase">🏆 CONGRATULATIONS 🏆</p>
              <h3 className="text-3xl font-black text-pink-600 mt-1 mb-2">
                {winner === "A" ? "👈 A隊 (Pink Team)" : "👉 B隊 (Blue Team)"} 勝利！
              </h3>
              <p className="text-slate-600 font-bold">A隊得分: {scoreA} 分  |  B隊得分: {scoreB} 分</p>
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

  return (
    <div className="w-full max-w-7xl mx-auto bg-white border-4 border-[#FFB6C1] p-6 rounded-3xl shadow-xl relative select-none">
      
      {/* Top Prompter Head Banner */}
      <div className="bg-[#FFF0F5] p-5 rounded-2xl border-3 border-[#FFB6C1] shadow-sm text-center mb-6 flex flex-col items-center justify-center relative w-full">
        <div className="flex justify-between items-center w-full mb-1.5">
          <span className="text-[#FF1493] font-black text-xs md:text-sm">👈 側 A提籃 (TEAM PINK)</span>
          <span className="bg-[#FFB6C1] text-white px-3.5 py-1 rounded-full text-xs font-black border border-[#FF69B4] shadow-sm">
            🦢 Swan Question: {round} / 8 (不限時)
          </span>
          <span className="text-[#1E90FF] font-black text-xs md:text-sm">側 B提籃 (TEAM BLUE) 👉</span>
        </div>

        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-2">
          {promptType === "en_to_ch" ? "題目給英文 ➔ 請拖拽中文意思的大白鵝" : "題目給中文 ➔ 請拖拽英文單詞的大白鵝"}
        </span>

        {/* Display target clue! */}
        <h3 className="text-3xl font-black text-slate-800 flex items-center gap-2">
          <span>{targetWord?.emoji}</span>
          <span className="text-[#FF2493] px-6 py-2 bg-white border-2 border-[#FFB6C1] rounded-full shadow-md font-extrabold">
            {promptType === "en_to_ch" ? targetWord?.english : targetWord?.chinese}
          </span>
        </h3>
      </div>

      {/* Main Playing Layout: Split columns */}
      <div className="grid grid-cols-12 gap-4 items-stretch relative min-h-[460px]">
        
        {/* Left scoring side: Basket A (Pink theme) */}
        <div className="col-span-12 md:col-span-3 bg-[rgba(255,105,180,0.15)] border-4 border-[#FF69B4] rounded-[25px] p-4 md:p-5 flex flex-col items-center justify-between text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-1 right-2 text-[#FF69B4]/30 text-4xl select-none">🧺</div>
          
          <div>
            <span className="text-xs font-black text-[#FF1493] bg-white px-3 py-1.5 rounded-full border border-[#FF69B4] shadow-sm">
              🧸 TEAM PINK (A)
            </span>
            <div className="text-3xl font-extrabold text-[#FF1493] mt-3 select-none">
              {scoreA} <span className="text-xs">PTS</span>
            </div>
          </div>

          {/* Huge wicker Basket Illustration */}
          <div className="w-full flex flex-col items-center justify-center my-6 py-4 bg-white/85 rounded-2xl border-2 border-[#FFB6C1] shadow-inner">
            <span className="text-7xl block animate-bounce filter drop-shadow">🧺</span>
            <p className="text-[10px] text-pink-700 font-extrabold mt-2">將白鵝朝此拖拉得分</p>
          </div>

          <div className="text-[10px] text-pink-600 font-bold">✨ 左隊專屬得分籃 🎈</div>
        </div>

        {/* Center: 3x3 Goose grid */}
        <div className="col-span-12 md:col-span-6 bg-[#FFF5F7] rounded-[25px] p-4 border-2 border-[#FFB6C1] flex flex-col justify-center relative">
          <div className="grid grid-cols-3 gap-3">
            {geese.map((goose) => {
              const matchesTarget = goose.word.id === targetWord?.id;
              const textToShow = promptType === "en_to_ch" ? goose.word.chinese : goose.word.english;
              const isBeingDragged = draggingNodeId === goose.index;

              // inline physics styles for dragging
              const style: React.CSSProperties = isBeingDragged
                ? {
                    position: "fixed",
                    left: `${dragPos.x - dragOffset.x}px`,
                    top: `${dragPos.y - dragOffset.y}px`,
                    transform: "scale(1.15) rotate(-3deg)",
                    zIndex: 1000,
                    pointerEvents: "none",
                  }
                : {
                    transform: `translate(${goose.xOffset}px, ${goose.yOffset}px)`,
                  };

              return (
                <div
                  key={goose.index}
                  onPointerDown={(e) => handlePointerDown(e, goose.index)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className={`bg-white rounded-[20px] p-3 border-3 border-dashed border-[#4FC3F7] hover:border-[#1E90FF] text-slate-800 shadow-sm transition-shadow flex flex-col items-center justify-center select-none text-center cursor-move relative min-h-[120px] ${
                    isBeingDragged ? "shadow-2xl" : "hover:shadow-md animate-wobble"
                  }`}
                  style={style}
                >
                  {/* Cute Cartoon Duck Head Icon */}
                  <div className="text-4xl mb-1.5 flex flex-col items-center select-none relative">
                    <span className="animate-bounce inline-block pointer-events-none">🦢</span>
                    {/* Tiny visual ribbon */}
                    <span className="absolute bottom-0 text-[10px] scale-75 select-none pointer-events-none">🎗️</span>
                  </div>

                  {/* Word card written on the goose */}
                  <div className="w-full">
                    <span className="block font-black text-[12px] md:text-[13px] text-[#4A4A4A] break-words leading-tight bg-[#FFF9C4]/60 border border-yellow-200 py-1 px-1 rounded-lg">
                      {textToShow}
                    </span>
                    <span className="text-[10px] text-cyan-600 font-extrabold select-none mt-0.5 block">
                      {goose.word.emoji}
                    </span>
                  </div>

                  {/* Desktop click hotlink submit for touchscreen whiteboards that don't drag nicely */}
                  <div className="mt-2 flex gap-1 w-full justify-between pointer-events-auto">
                    <button
                      onPointerDown={(e) => e.stopPropagation()} // stop dragging
                      onClick={() => handleTapSubmitGoose(goose, "A")}
                      className="px-1 py-0.5 bg-pink-100 hover:bg-pink-200 border border-pink-300 rounded text-[9px] text-pink-700 font-bold cursor-pointer font-sans"
                      title="投入左籃"
                    >
                      投A 🧺
                    </button>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => handleTapSubmitGoose(goose, "B")}
                      className="px-1 py-0.5 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded text-[9px] text-sky-700 font-bold cursor-pointer font-sans"
                      title="投入右籃"
                    >
                      投B 🧺
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] bg-white text-[#1E90FF] px-3 py-1.5 rounded-full border-2 border-[#4FC3F7] font-bold block shadow-sm">
              ⭐ 大白鵝們正在草地上快樂踱步！拖著合適的白鵝滑進兩側的「大提籃」中提交您的答案 🎀
            </span>
          </div>
        </div>

        {/* Right scoring side: Basket B (Blue theme) */}
        <div className="col-span-12 md:col-span-3 bg-[rgba(30,144,255,0.15)] border-4 border-[#1E90FF] rounded-[25px] p-4 md:p-5 flex flex-col items-center justify-between text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-1 left-2 text-[#1E90FF]/25 text-4xl select-none">🧺</div>
          
          <div>
            <span className="text-xs font-black text-[#1E90FF] bg-white px-3 py-1.5 rounded-full border border-[#1E90FF] shadow-sm">
              🧸 TEAM BLUE (B)
            </span>
            <div className="text-3xl font-extrabold text-[#1E90FF] mt-3 select-none text-center">
              {scoreB} <span className="text-xs">PTS</span>
            </div>
          </div>

          {/* Huge wicker Basket Illustration */}
          <div className="w-full flex flex-col items-center justify-center my-6 py-4 bg-white/80 rounded-2xl border-2 border-sky-300 shadow-inner">
            <span className="text-7xl block animate-bounce filter drop-shadow">🧺</span>
            <p className="text-[10px] text-sky-700 font-extrabold mt-2">將白鵝朝此拖拉提交分數</p>
          </div>

          <div className="text-[10px] text-[#1E90FF] font-bold">✨ 右隊專屬得分籃 🎈</div>
        </div>

      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setGameStarted(false)}
          className="px-5 py-2.5 bg-slate-400 border-b-4 border-slate-600 text-white font-bold text-xs rounded-full hover:bg-slate-500 transition cursor-pointer"
        >
          放棄此場，回到最初
        </button>
      </div>

    </div>
  );
}
