import React, { useState } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { RefreshCw, Trophy, Crown, ArrowLeft } from "lucide-react";
import MarioCharacterSprite from "./MarioCharacterSprite";

interface ClimbLadderProps {
  onBack: () => void;
  playersCount: 3 | 4; 
}

interface PlayerState {
  id: number;
  name: string;
  avatar: string;
  character: "mario" | "luigi" | "peach" | "toad";
  color: string;
  badgeBg: string;
  borderColor: string;
  rung: number; // 0 to 10
  currentQuestionIndex: number; // 0 to 9
  isFinished: boolean;
  score: number;
  personalQuestions: Word[]; // 10 unique questions shuffled
  optionsForCurrent: Word[]; // 4 options
}

const AVATAR_POOL = [
  { emoji: "👨‍🔧", name: "Mario / 瑪利歐", character: "mario" as const, color: "text-white bg-[#E52521]", badgeBg: "bg-[#E52521]/15", border: "border-[#E52521]" },
  { emoji: "🧑‍🔧", name: "Luigi / 路易吉", character: "luigi" as const, color: "text-white bg-[#00A24A]", badgeBg: "bg-[#00A24A]/15", border: "border-[#00A24A]" },
  { emoji: "👸", name: "Peach / 碧姬公主", character: "peach" as const, color: "text-white bg-[#FF69B4]", badgeBg: "bg-[#FF69B4]/15", border: "border-[#FF69B4]" },
  { emoji: "🍄", name: "Toad / 奇諾比奧", character: "toad" as const, color: "text-black bg-[#FED42C]", badgeBg: "bg-[#FED42C]/15", border: "border-black" }
];


export default function ClimbLadder({ onBack, playersCount }: ClimbLadderProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [allFinished, setAllFinished] = useState<boolean>(false);

  const chapters = CHAPTERS;

  const buildGame = (chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    if (filtered.length < 15) {
      filtered = WORD_LIST; 
    }

    const createdPlayers: PlayerState[] = [];

    for (let pIdx = 0; pIdx < playersCount; pIdx++) {
      const avatarMeta = AVATAR_POOL[pIdx];
      
      // Shuffle list to get 10 random questions for this player
      const pQuestions = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
      
      // Seed 4 options (1 correct, 3 distractors) for the first question
      const firstQ = pQuestions[0];
      const poolWithoutFirst = filtered.filter(w => w.id !== firstQ.id);
      const distractors = [...poolWithoutFirst].sort(() => Math.random() - 0.5).slice(0, 3);
      const startOptions = [firstQ, ...distractors].sort(() => Math.random() - 0.5);

      createdPlayers.push({
        id: pIdx + 1,
        name: avatarMeta.name,
        avatar: avatarMeta.emoji,
        character: avatarMeta.character,
        color: avatarMeta.color,
        badgeBg: avatarMeta.badgeBg,
        borderColor: avatarMeta.border,
        rung: 0,
        currentQuestionIndex: 0,
        isFinished: false,
        score: 0,
        personalQuestions: pQuestions,
        optionsForCurrent: startOptions
      });
    }

    setPlayers(createdPlayers);
    setAllFinished(false);
    setGameStarted(true);
  };

  const handlePlayerSubmit = (playerId: number, selectedWordId: string) => {
    setPlayers((prevPlayers) => {
      const updated = prevPlayers.map((player) => {
        if (player.id !== playerId || player.isFinished) return player;

        const currentWord = player.personalQuestions[player.currentQuestionIndex];
        const isCorrect = selectedWordId === currentWord.id;

        let nextRung = player.rung;
        let nextScore = player.score;

        if (isCorrect) {
          nextRung = Math.min(player.rung + 1, 10); // climb up 1 stair
          nextScore += 10;
          playCorrectSound();
        } else {
          playIncorrectSound();
        }

        const nextIndex = player.currentQuestionIndex + 1;
        const reachedMax = nextIndex >= 10;

        let nextOptions: Word[] = [];
        if (!reachedMax) {
          const nextQ = player.personalQuestions[nextIndex];
          let activePool = WORD_LIST.filter(w => selectedChapter === "All" || w.chapter === selectedChapter);
          if (activePool.length < 5) activePool = WORD_LIST;
          
          const poolWithoutNext = activePool.filter(w => w.id !== nextQ.id);
          const distractors = [...poolWithoutNext].sort(() => Math.random() - 0.5).slice(0, 3); // 3 distractors for 4 choices!
          nextOptions = [nextQ, ...distractors].sort(() => Math.random() - 0.5);
        }

        return {
          ...player,
          rung: nextRung,
          score: nextScore,
          currentQuestionIndex: nextIndex,
          isFinished: reachedMax,
          optionsForCurrent: nextOptions
        };
      });

      const checkAllDone = updated.every(p => p.isFinished);
      if (checkAllDone) {
        setAllFinished(true);
      }

      return updated;
    });
  };

  if (!gameStarted) {
    return (
      <div className="w-full bg-[#FFF8E7] p-8 rounded-3xl border-4 border-black text-center relative max-w-2xl mx-auto shadow-[6px_6px_0px_#000000]">
        <div className="absolute top-3 left-3 text-3xl animate-bounce">🪜</div>
        <div className="absolute top-3 right-3 text-3xl animate-spin">🪙</div>
        
        <h2 className="text-3xl font-black text-[#E52521] mb-2 flex items-center justify-center gap-2" style={{ textShadow: "1.5px 1.5px 0px #000" }}>
          <span>🪜 {playersCount}人爬爬梯大賽 (4個選項)</span>
        </h2>
        
        <p className="text-stone-700 font-bold text-sm mb-6 leading-relaxed bg-white/70 p-4 rounded-xl border-2 border-black inline-block mt-2">
          🍄 多人趣味爬梯擂台賽！Mario 冒險風格！
          <br />題目給中文及 Emojis，玩家從 <span className="text-[#E52521] font-extrabold">4個選項</span> 中找出英文，答對人偶就會向上爬一格！
          <br />⭐ 當有人登頂時，其他人依舊可以繼續作答挑戰！
        </p>

        <div className="bg-white p-6 rounded-2xl border-4 border-black mb-6 shadow-[4px_4px_0px_#000000]">
          <label className="block text-[#0043A4] font-black text-base mb-3 flex items-center justify-center gap-1">
            <span>⭐️ 請選擇單詞範圍 ⭐️</span>
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
            onClick={() => buildGame(selectedChapter)}
            className="mario-btn mario-btn-red px-8 py-3 text-sm cursor-pointer"
          >
            <span>🚀 進入考驗 🍄</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-5 rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000000] relative">
      
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-[#FFF8E7] p-3 rounded-2xl border-3 border-black gap-2 shadow-inner">
        <button
          onClick={() => setGameStarted(false)}
          className="px-4 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-black text-[#E52521] hover:bg-red-50 flex items-center gap-1 cursor-pointer transition"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>重新選擇範圍 / 玩家數</span>
        </button>

        <h3 className="text-sm md:text-base font-black text-stone-900 tracking-wider flex items-center gap-1 font-pixel">
          <span>🎮 LADDER CLIMB DUEL 🎮</span>
        </h3>

        {allFinished ? (
          <button
            onClick={() => buildGame(selectedChapter)}
            className="px-4 py-1.5 bg-[#00A24A] hover:bg-[#02c35a] border-2 border-black text-white font-black text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重新開一局 🚀</span>
          </button>
        ) : (
          <div className="bg-red-100 border border-[#E52521] px-3 py-1 rounded-xl text-xs font-bold text-[#E52521]">
            挑戰中... ⚡
          </div>
        )}
      </div>

      {/* Synchronous side-by-side columns matching the playersCount */}
      <div className={`grid gap-5 ${playersCount === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"} items-stretch`}>
        {players.map((p) => {
          const currentWord = p.personalQuestions[p.currentQuestionIndex];
          const options = p.optionsForCurrent;
          const displayRung = p.rung; // 0 to 10
          
          const rungsList = Array.from({ length: 11 }, (_, i) => 10 - i);

          return (
            <div 
              key={p.id}
              className={`p-4 rounded-2xl border-4 border-black flex flex-col justify-between shadow-[4px_4px_0px_#000000] relative bg-[#FFFEEF] ${p.badgeBg}`}
            >
              
              {/* Player Top Meta Header */}
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3 bg-white p-2 rounded-xl border-2">
                <div className="flex items-center gap-1.5">
                  <MarioCharacterSprite character={p.character} animation={p.isFinished ? "win" : "idle"} size={36} />
                  <div className="text-xs font-black text-stone-900 leading-tight">
                    <span className="block text-stone-400 font-pixel text-[8px]">PLAYER {p.id}</span>
                    <span>{p.name.split('/')[0]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-black text-[#E52521] leading-none">{p.score}<span className="text-[10px]"> pts</span></span>
                </div>
              </div>

              {/* Graphical Ladder Panel inside a bricks container */}
              <div className="bg-[#5C94FC] rounded-xl p-3 border-3 border-black flex-grow flex items-center justify-center relative min-h-[260px] shadow-inner overflow-hidden">
                {/* Background decorative pixel clouds */}
                <div className="absolute top-2 left-2 text-white/40 text-[10px] uppercase font-pixel tracking-tighter select-none">sky-zone</div>
                <div className="absolute top-1/4 right-3 bg-white/50 w-8 h-3 rounded-full blur-[1px]"></div>
                <div className="absolute top-2/3 left-4 bg-white/50 w-10 h-4 rounded-full blur-[1px]"></div>

                {/* Lateral vertical rails of ladder - Mario wood-style ladders */}
                <div className="absolute left-1/3 w-2.5 bg-amber-700 inset-y-4 rounded border border-black shadow"></div>
                <div className="absolute right-1/3 w-2.5 bg-amber-700 inset-y-4 rounded border border-black shadow"></div>

                {/* Horizontal Rungs of ladder */}
                <div className="w-full h-full flex flex-col justify-between py-4 relative z-10">
                  {rungsList.map((rungNum) => {
                    const isOccupied = displayRung === rungNum;

                    return (
                      <div 
                        key={rungNum} 
                        className="h-5 flex items-center justify-center relative w-full"
                      >
                        {/* The wood cross bar join */}
                        <div className="absolute left-1/3 right-1/3 h-1.5 bg-amber-600 border-y border-black"></div>
                        
                        {/* Small Rung label marker */}
                        <span className="absolute left-3 text-[8px] font-pixel text-white leading-none">
                          {rungNum === 10 ? "GOAL" : `#${rungNum}`}
                        </span>

                        {/* Player Character climbing placement */}
                        {isOccupied && (
                          <div className="absolute animate-[bounce_1s_infinite] z-20 flex flex-col items-center">
                            {rungNum === 10 ? (
                              <div className="flex flex-col items-center scale-110">
                                <Crown className="w-4 h-4 text-yellow-300 fill-yellow-200 animate-spin mb-1" />
                                <MarioCharacterSprite character={p.character} animation="win" size={36} />
                              </div>
                            ) : (
                              <MarioCharacterSprite character={p.character} animation="climb" size={32} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Quiz block beneath ladder */}
              <div className="mt-4 pt-3 border-t-2 border-black">
                {p.isFinished ? (
                  <div className="bg-[#FFFEEF] border-3 border-black text-center p-3 rounded-xl flex flex-col items-center justify-center min-h-[160px] text-stone-900 shadow">
                    <Trophy className="w-9 h-9 text-amber-500 fill-amber-200 animate-bounce mb-1" />
                    <span className="text-xs font-black text-[#00A24A]">順利登頂！🏆</span>
                    <span className="text-[10px] text-stone-500 mt-1">恭喜通關庫巴挑戰！</span>
                  </div>
                ) : (
                  <div className="bg-white p-2.5 rounded-xl border-3 border-black flex flex-col gap-2.5 min-h-[170px] justify-between shadow-[2px_2px_0px_#000]">
                    {/* Clue Prompt */}
                    <div className="text-center bg-[#FFF8E7] p-2 rounded-lg border-2 border-black">
                      <span className="text-[8px] font-pixel text-[#E52521] block">STAIR {p.currentQuestionIndex + 1} / 10</span>
                      <span className="text-xs md:text-sm font-black text-stone-800 tracking-tight leading-tight block mt-1">
                        {currentWord?.emoji} {currentWord?.chinese}
                      </span>
                    </div>

                    {/* 4 MCQ Options now! */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handlePlayerSubmit(p.id, opt.id)}
                          className="py-1.5 bg-stone-50 hover:bg-[#FED42C] border-2 border-black text-[9px] md:text-[10px] font-black text-stone-900 rounded-lg text-center transition active:scale-95 cursor-pointer leading-tight truncate px-1 text-wrap"
                        >
                          {opt.english}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center border-t-4 border-black pt-5">
        <button
          onClick={onBack}
          className="mario-btn mario-btn-red px-6 py-2.5 text-xs inline-flex items-center gap-1 cursor-pointer"
        >
          <span>退出挑戰，返回大廳</span>
        </button>
      </div>

    </div>
  );
}
