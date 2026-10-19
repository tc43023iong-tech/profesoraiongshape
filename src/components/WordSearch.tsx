import React, { useState, useEffect } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Star, Trophy, Search, CheckCircle } from "lucide-react";

interface WordSearchProps {
  onBack: () => void;
}

interface GridCell {
  row: number;
  col: number;
  char: string;
  wordIds: string[]; // which words cross this cell
  isMatched: boolean;
  matchColor?: string; // custom highlight color
}

interface SearchWord {
  id: string;
  text: string; // lowercase english we are seeking
  chinese: string;
  emoji: string;
  isFound: boolean;
  cells: { r: number; c: number }[]; // coordinates of this word
  color: string;
}

const HIGHLIGHT_COLORS = [
  "bg-pink-200/90 text-pink-700 font-black scale-105 border border-pink-400/50",
  "bg-sky-200/90 text-sky-700 font-black scale-105 border border-sky-400/50",
  "bg-amber-200/90 text-amber-700 font-black scale-105 border border-amber-400/50",
  "bg-emerald-200/90 text-emerald-700 font-black scale-105 border border-emerald-400/50",
  "bg-purple-200/90 text-purple-700 font-black scale-105 border border-purple-400/50",
  "bg-rose-200/90 text-rose-700 font-black scale-105 border border-rose-400/50"
];

const COLORS_MAP = [
  "border-pink-300 bg-pink-100",
  "border-sky-300 bg-sky-100",
  "border-amber-300 bg-amber-100",
  "border-emerald-300 bg-emerald-100",
  "border-purple-300 bg-purple-100",
  "border-rose-300 bg-rose-150"
];

export default function WordSearch({ onBack }: WordSearchProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [wordsToFind, setWordsToFind] = useState<SearchWord[]>([]);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [gridSize, setGridSize] = useState<number>(10);
  
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const chapters = CHAPTERS;

  const generateWordSearch = (chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    // Shuffle and pick up to 6 words
    const shuffledPool = [...filtered].sort(() => Math.random() - 0.5);
    // Filter words that fit nicely (e.g. length <= 10, no super long ones, but let's support up to 10 letters)
    const candidates = shuffledPool.filter(w => w.english.replace(/ /g, "").length <= 8).slice(0, 6);
    
    if (candidates.length === 0) return;

    const size = 10;
    setGridSize(size);

    // Initialize blank grid
    const tempGrid: GridCell[][] = Array(size).fill(null).map((_, r) =>
      Array(size).fill(null).map((_, c) => ({
        row: r,
        col: c,
        char: "",
        wordIds: [],
        isMatched: false
      }))
    );

    const placedWords: SearchWord[] = [];

    // Directions: [dRow, dCol] (horizontal, vertical, diagonal down-right)
    const directions = [
      [0, 1],   // right
      [1, 0],   // down
      [1, 1],   // diagonal down-right
    ];

    candidates.forEach((vocab, idx) => {
      // Lowercase text with spacing stripped out or just kept?
      // "Word Search全部用小寫", so we use lowercase and search text
      const cleanWord = vocab.english.toLowerCase().replace(/ /g, "");
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);

        // Check bounds
        const endRow = startRow + dir[0] * (cleanWord.length - 1);
        const endCol = startCol + dir[1] * (cleanWord.length - 1);

        if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
          // Check collision
          let works = true;
          const coordList: { r: number; c: number }[] = [];

          for (let i = 0; i < cleanWord.length; i++) {
            const r = startRow + dir[0] * i;
            const c = startCol + dir[1] * i;
            const cellChar = tempGrid[r][c].char;

            if (cellChar !== "" && cellChar !== cleanWord[i]) {
              works = false;
              break;
            }
            coordList.push({ r, c });
          }

          if (works) {
            // Place it!
            coordList.forEach(({ r, c }, charIdx) => {
              tempGrid[r][c].char = cleanWord[charIdx];
              tempGrid[r][c].wordIds.push(vocab.id);
            });

            placedWords.push({
              id: vocab.id,
              text: cleanWord,
              chinese: vocab.chinese,
              emoji: vocab.emoji,
              isFound: false,
              cells: coordList,
              color: HIGHLIGHT_COLORS[idx % HIGHLIGHT_COLORS.length]
            });
            placed = true;
          }
        }
      }
    });

    // Feed remaining empty characters with random lowercases 'a'..'z'
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (tempGrid[r][c].char === "") {
          const randChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // standard lowercase
          tempGrid[r][c].char = randChar;
        }
      }
    }

    setGrid(tempGrid);
    setWordsToFind(placedWords);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  // Helper function to check if word is found
  const handleCheckWordFound = (wordId: string) => {
    setWordsToFind((prev) => {
      const matchIdx = prev.findIndex(item => item.id === wordId);
      if (matchIdx === -1 || prev[matchIdx].isFound) return prev;

      const target = prev[matchIdx];
      
      // Update grid cells of that word to matched
      setGrid((prevGrid) => {
        const nextGrid = [...prevGrid];
        target.cells.forEach(({ r, c }) => {
          nextGrid[r][c] = {
            ...nextGrid[r][c],
            isMatched: true,
            matchColor: target.color
          };
        });
        return nextGrid;
      });

      playCorrectSound();

      const updated = [...prev];
      updated[matchIdx] = { ...target, isFound: true };

      // Add to score
      setScore((s) => s + 20);

      // Check if all found
      const allFound = updated.every(item => item.isFound);
      if (allFound) {
        setTimeout(() => setGameOver(true), 1500);
      }

      return updated;
    });
  };

  // User click/drag selection in Grid to solve
  const handleCellClick = (r: number, c: number) => {
    if (startCell === null) {
      setStartCell({ r, c });
      setHoveredCell({ r, c });
    } else {
      // Second cell selection: Try to see if it matches any word's start and end coordinates!
      const minR = Math.min(startCell.r, r);
      const maxR = Math.max(startCell.r, r);
      const minC = Math.min(startCell.c, c);
      const maxC = Math.max(startCell.c, c);

      // Find if we matches any words coordinates
      const matchedWord = wordsToFind.find((word) => {
        if (word.isFound) return false;
        const wCells = word.cells;
        const first = wCells[0];
        const last = wCells[wCells.length - 1];

        const matchNormal = (first.r === startCell.r && first.c === startCell.c && last.r === r && last.c === c);
        const matchReverse = (last.r === startCell.r && last.c === startCell.c && first.r === r && first.c === c);
        return matchNormal || matchReverse;
      });

      if (matchedWord) {
        handleCheckWordFound(matchedWord.id);
      } else {
        // Did not match any words
        playIncorrectSound();
      }

      setStartCell(null);
      setHoveredCell(null);
    }
  };

  // Helper auto reveal trigger requested: "點一下那個單詞，可以幫我直接找出來"
  const handleAutoRevealWord = (word: SearchWord) => {
    if (word.isFound) return;
    handleCheckWordFound(word.id);
  };

  if (!gameStarted) {
    return (
      <div className="w-full bg-pink-50/50 p-6 rounded-3xl border-4 border-pink-200 text-center relative max-w-2xl mx-auto shadow-md">
        <div className="absolute top-2 left-2 text-3xl">🔍</div>
        <div className="absolute top-2 right-2 text-3xl">🎀</div>
        <h2 className="text-3xl font-extrabold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <span>Word Search 單詞搜尋器 🔍</span>
        </h2>
        <p className="text-pink-500 font-medium text-sm mb-6">
          字母全部都是可愛的小寫！找出隱藏在字母方塊中的單詞。如果卡住了，可以點右邊單詞，小幫手會直接在上方幫你找出來喔！💡🧚‍♀️
        </p>

        <div className="bg-white/80 p-6 rounded-2xl border-2 border-pink-100 mb-6 shadow-sm">
          <label className="block text-pink-700 font-extrabold text-base mb-3">
            🎀 請選擇要搜尋的單詞範圍：
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
            onClick={() => generateWordSearch(selectedChapter)}
            className="px-8 py-3 bg-pink-500 border-b-4 border-pink-700 hover:bg-pink-600 font-extrabold text-white text-lg rounded-full transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>🚀 進入方塊 🎀</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-pink-300 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
        <Trophy className="w-20 h-20 text-yellow-500 fill-yellow-250 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-pink-600 mb-2">🎉 尋詞天才誕生！ 🎉</h2>
        <p className="text-slate-600 font-medium mb-6">
          所有的單詞都被你敏銳的目光發掘出來了！偵探勛章頒發給你！🏅✨
        </p>

        <div className="bg-pink-50 py-4 px-6 rounded-2xl border-2 border-pink-200 inline-block mb-6 shadow-inner">
          <span className="text-slate-500 text-xs font-bold block mb-1">SCORE 🏆</span>
          <span className="text-3xl font-black text-pink-600">總積分: {score} 分</span>
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
    <div className="w-full max-w-5xl mx-auto bg-pink-50/50 p-6 rounded-3xl border-4 border-pink-200 shadow-lg relative">
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
          <Search className="w-3.5 h-3.5 text-pink-500" />
          <span>單詞拼寫均為小寫 📚</span>
        </div>

        <div className="bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-black text-emerald-700">
          得分: {score}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: The Letter Grid Board */}
        <div className="md:col-span-8 bg-white p-4 justify-center items-center rounded-2xl border-3 border-pink-100 shadow-sm flex flex-col">
          <div className="grid grid-cols-10 gap-1.5 w-full aspect-square max-w-[450px]">
            {grid.map((rowCells, r) =>
              rowCells.map((cell, c) => {
                const isSelectedStart = startCell && startCell.r === r && startCell.c === c;
                const isHovered = hoveredCell && hoveredCell.r === r && hoveredCell.c === c;

                let cellBg = "bg-pink-50/20 text-slate-700 hover:bg-pink-50 cursor-pointer";
                if (cell.isMatched && cell.matchColor) {
                  cellBg = cell.matchColor;
                } else if (isSelectedStart) {
                  cellBg = "bg-pink-400 text-white font-extrabold scale-110 shadow-md";
                }

                return (
                  <button
                    key={`${r}_${c}`}
                    onClick={() => handleCellClick(r, c)}
                    onMouseEnter={() => startCell && setHoveredCell({ r, c })}
                    className={`w-full h-full font-bold text-base md:text-lg rounded-xl border border-pink-100 flex items-center justify-center select-none transition-all duration-150 relative ${cellBg}`}
                  >
                    {cell.char}
                  </button>
                );
              })
            )}
          </div>

          <p className="text-[11px] text-pink-400 font-bold mt-4">
            💡 先點擊單詞在方格中起點字母，再點擊終點字母，即可標記找出單詞！
          </p>
        </div>

        {/* Right Side: Words target list with Direct click reveal! */}
        <div className="md:col-span-4 flex flex-col justify-between bg-pink-100/60 p-5 rounded-2xl border border-pink-200/80">
          <div>
            <h4 className="text-sm font-black text-pink-700 uppercase mb-3 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-pink-200 shadow-sm">
              <span>🎏 待尋找單詞清單 ({wordsToFind.filter(i => !i.isFound).length} 未找)</span>
            </h4>
            <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
              {wordsToFind.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleAutoRevealWord(word)}
                  className={`w-full py-2.5 px-3.5 rounded-2xl flex items-center justify-between font-bold text-xs md:text-sm text-left shadow-sm border-2 select-none transition-all duration-200 group cursor-pointer ${
                    word.isFound
                      ? "bg-emerald-100 border-emerald-300 text-emerald-700 line-through scale-95 opacity-80"
                      : "bg-white border-pink-100 text-slate-800 hover:scale-102 hover:border-pink-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 break-all">
                    <span className="text-lg">{word.emoji}</span>
                    <div>
                      <span className="block font-black">{word.text}</span>
                      <span className="text-[10px] text-slate-500 font-medium ">{word.chinese}</span>
                    </div>
                  </div>
                  {word.isFound ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-pink-50 text-pink-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-pink-200 shrink-0">
                      幫我找 🪄
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white/80 p-3 rounded-xl border border-pink-200">
            <p className="text-[10px] text-pink-600 font-semibold leading-relaxed">
              ⭐ 學英文提示：點一下右邊的綠色「幫我找」或是單詞，小仙女就會神奇地在方格內直接塗上專屬色彩揭開答案哦！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
