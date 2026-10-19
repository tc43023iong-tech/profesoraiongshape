import React, { useState, useEffect } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Star, Trophy, Delete, Check, Play } from "lucide-react";

interface SpellingBeeProps {
  onBack: () => void;
  isCompetitionMode?: boolean; // If true: 3 questions max
}

interface LetterNode {
  index: number;
  char: string;
  isUsed: boolean;
}

export default function SpellingBee({ onBack, isCompetitionMode = false }: SpellingBeeProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // States mapping the current question's letters
  const [targetWord, setTargetWord] = useState<string>("");
  const [letterButtons, setLetterButtons] = useState<LetterNode[]>([]);
  const [guessSlots, setGuessSlots] = useState<(LetterNode | null)[]>([]);
  
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWordCorrect, setIsWordCorrect] = useState<boolean | null>(null);

  const chapters = CHAPTERS;

  const startGame = (chapter: string) => {
    let filtered = filterWordsByChapter(chapter);
    // Shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    if (shuffled.length === 0) return;

    // Limit to 3 in competition mode
    const limit = isCompetitionMode ? 3 : shuffled.length;
    const finalQuestions = shuffled.slice(0, limit);

    setQuestions(finalQuestions);
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setGameStarted(true);
    
    loadWord(finalQuestions[0]);
  };

  const loadWord = (word: Word) => {
    // Spelling bee is always in lowercase
    const cleanWord = word.english.toLowerCase();
    setTargetWord(cleanWord);
    setIsWordCorrect(null);

    // Build letter nodes for ALL non-space characters of the word
    const nodes: LetterNode[] = [];
    let counter = 0;
    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      if (char !== " ") {
        nodes.push({
          index: counter++,
          char: char,
          isUsed: false
        });
      }
    }

    // Shuffle the letter buttons so they are scrambled!
    const scrambledNodes = [...nodes].sort(() => Math.random() - 0.5);
    setLetterButtons(scrambledNodes);

    // Build empty guess slots representing the spaces in the cleanWord.
    // Spaces will not have guess slots. They are automatically represented as gaps (finger spaces).
    const initialSlots: (LetterNode | null)[] = [];
    for (let i = 0; i < cleanWord.length; i++) {
      if (cleanWord[i] === " ") {
        // Space doesn't need input, we represent it in rendering
        initialSlots.push(null); 
      } else {
        // Empty slot placeholder
        initialSlots.push(null);
      }
    }
    setGuessSlots(initialSlots);
  };

  // Click on a scrambled letter button (to add to guess slots)
  const handleSelectLetter = (node: LetterNode) => {
    if (isWordCorrect !== null) return; // Wait for transitions

    // Find the first empty slot that is NOT a space index
    const cleanWordChars = targetWord.split("");
    const nextEmptyIndex = guessSlots.findIndex((slot, idx) => {
      return cleanWordChars[idx] !== " " && slot === null;
    });

    if (nextEmptyIndex !== -1) {
      // Add letter node to that slot
      const updatedSlots = [...guessSlots];
      updatedSlots[nextEmptyIndex] = node;
      setGuessSlots(updatedSlots);

      // Hide the letter from palette: "所有spelling bee只出現這個單詞的字母，點擊後就要消失"
      setLetterButtons((prev) =>
        prev.map(btn => (btn.index === node.index ? { ...btn, isUsed: true } : btn))
      );

      // Check if word is complete
      checkCompletion(updatedSlots);
    }
  };

  // Click on a letter in guess slots (to retract/cancel)
  const handleRetractLetter = (slotIndex: number) => {
    if (isWordCorrect !== null) return;
    const node = guessSlots[slotIndex];
    if (node === null) return; // empty slot, nothing to retract

    // Put it back in letterButtons (make it reappered)
    setLetterButtons((prev) =>
      prev.map(btn => (btn.index === node.index ? { ...btn, isUsed: false } : btn))
    );

    // Empty that slot
    const updatedSlots = [...guessSlots];
    updatedSlots[slotIndex] = null;
    setGuessSlots(updatedSlots);
  };

  const checkCompletion = (currentSlots: (LetterNode | null)[]) => {
    // Compare letters to targetWord
    const cleanLetters = targetWord.split("");
    
    // Check if there is still any unfilled slots (non-space)
    const isFullyFilled = currentSlots.every((slot, idx) => {
      if (cleanLetters[idx] === " ") return true; // space is fine
      return slot !== null;
    });

    if (!isFullyFilled) return;

    // Build the spelled word
    const spelled = currentSlots.map((slot, idx) => {
      if (cleanLetters[idx] === " ") return " ";
      return slot ? slot.char : "";
    }).join("");

    if (spelled === targetWord) {
      // WIN WORD!
      setIsWordCorrect(true);
      setScore(prev => prev + 1);
      playCorrectSound();

      setTimeout(() => {
        advanceGame();
      }, 1500);
    } else {
      // LOSE WORD, trigger shake, but don't clear immediately, let children cancel mistakes!
      setIsWordCorrect(false);
      playIncorrectSound();
      // Let it stay in incorrect state briefly, then reset and let them correct their spelling!
      setTimeout(() => {
        setIsWordCorrect(null);
      }, 1500);
    }
  };

  const advanceGame = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      loadWord(questions[nextIndex]);
    } else {
      setGameOver(true);
    }
  };

  // Split word into subwords so we can render beautiful finger spaces!
  // E.g. "sugary food" -> ["sugary", "food"]
  const subwords = targetWord.split(" ");

  if (!gameStarted) {
    return (
      <div className="w-full bg-pink-50/50 p-6 rounded-3xl border-4 border-pink-200 text-center relative max-w-2xl mx-auto shadow-md">
        <div className="absolute top-2 left-2 text-3xl">🔠</div>
        <div className="absolute top-2 right-2 text-3xl">🐝</div>
        <h2 className="text-3xl font-extrabold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <span>{isCompetitionMode ? "🏆 Spelling Bee Competition (3題組)" : "🐝 Spelling Bee 拼字大考驗"}</span>
        </h2>
        <p className="text-pink-500 font-medium text-sm mb-6">
          根據中文題目與 Emoji，點擊可愛的字母拼出英文單詞！點錯字母點擊上方格子便能取消喔！💅
        </p>

        <div className="bg-white/80 p-6 rounded-2xl border-2 border-pink-100 mb-6 shadow-sm">
          <label className="block text-pink-700 font-extrabold text-base mb-3">
            🎀 請選擇拼字大挑戰範圍：
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
            <Play className="w-5 h-5 fill-white text-white" />
            <span>開始拼字 🎀</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="w-full bg-white p-8 rounded-3xl border-4 border-pink-300 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
        <Trophy className="w-20 h-20 text-yellow-400 fill-yellow-100 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-black text-pink-600 mb-2">🎉 恭喜拼字王誕生！ 🎉</h2>
        <p className="text-slate-600 font-medium mb-6">
          你的拼字速度和準確度簡直是宇宙無敵棒！🚀
        </p>

        <div className="bg-pink-50 py-4 px-6 rounded-2xl border-2 border-pink-200 inline-block mb-6 shadow-inner">
          <span className="text-slate-500 text-xs font-bold block mb-1">ACCURACY 🏆</span>
          <span className="text-3xl font-black text-pink-600">{score} / {questions.length} 題全對</span>
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

  // Helper calculation to map absolute guess slot indices to subword rendering
  let globalSlotCounter = 0;

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
          <span>單詞: {currentIndex + 1} / {questions.length}</span>
        </div>

        <div className="bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-black text-emerald-700">
          答對題數: {score}
        </div>
      </div>

      {/* Target Word Clue Panel */}
      <div className="bg-white p-5 rounded-2xl border-3 border-pink-100 text-center shadow-sm mb-6 flex flex-col items-center justify-center relative">
        <span className="text-5xl mb-2 animate-pulse">{currentWord?.emoji}</span>
        <h3 className="text-2xl font-black text-slate-800 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
          {currentWord?.chinese}
        </h3>
        <p className="text-xs text-pink-400 mt-2 font-medium">✨ 請使用下方的字母拼出對應的英文！ ✨</p>
      </div>

      {/* Letter Guess Slots (with Finger Space) */}
      <div className="bg-white/70 p-6 rounded-2xl border-2 border-pink-200 shadow-inner flex flex-wrap items-center justify-center gap-y-6 gap-x-12 mb-6">
        {subwords.map((subword, wordIdx) => {
          const subwordElements = [];
          for (let charIdx = 0; charIdx < subword.length; charIdx++) {
            const currentGlobalIndex = globalSlotCounter;
            const filledNode = guessSlots[currentGlobalIndex];
            
            subwordElements.push(
              <div
                key={charIdx}
                onClick={() => filledNode !== null && handleRetractLetter(currentGlobalIndex)}
                className={`w-11 h-11 md:w-12 md:h-12 border-3 rounded-xl flex items-center justify-center font-extrabold text-lg select-none cursor-pointer transition-all duration-150 relative ${
                  filledNode !== null
                    ? "bg-pink-400 border-pink-500 text-white scale-105 shadow-md active:scale-95"
                    : "bg-pink-50/50 border-pink-200 border-dashed text-pink-300"
                } ${isWordCorrect === true ? "bg-emerald-500 border-emerald-600 text-white animate-bounce" : ""} ${isWordCorrect === false ? "bg-rose-500 border-rose-600 text-white animate-shake" : ""}`}
              >
                {filledNode ? filledNode.char : ""}
                
                {/* Visual helper to remind that users can click to retract */}
                {filledNode && (
                  <span className="absolute -top-1.5 -right-1 bg-pink-600 text-[8px] text-white p-0.5 rounded-full font-black leading-none scale-75 select-none">
                    ✕
                  </span>
                )}
              </div>
            );
            globalSlotCounter++;
          }
          
          // Increment for the space that separates subwords (if not last word)
          if (wordIdx < subwords.length - 1) {
            globalSlotCounter++; // account for space slot
          }

          return (
            <div key={wordIdx} className="flex gap-1.5 items-center">
              {/* Individual subword tile row */}
              <div className="flex gap-1.5">
                {subwordElements}
              </div>
              
              {/* Let's render a cute physical "finger spacer" 🖐️ emoji indicating space between words! */}
              {wordIdx < subwords.length - 1 && (
                <div className="flex flex-col items-center justify-center mx-1 text-pink-300 font-bold select-none text-center">
                  <span className="text-xl animate-bounce">🖐️</span>
                  <span className="text-[9px] bg-pink-100 text-pink-500 px-1.5 py-0.5 rounded-full scale-90 border border-pink-200">
                    Finger Space
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scrambled input palette of letters: "所有spelling bee只出現這個單詞的字母，點擊後就要消失" */}
      <div className="flex flex-wrap justify-center gap-3 select-none mb-6">
        {letterButtons.map((btn) => (
          <button
            key={btn.index}
            onClick={() => handleSelectLetter(btn)}
            disabled={btn.isUsed || isWordCorrect !== null}
            className={`w-12 h-12 md:w-14 md:h-14 font-black rounded-2xl flex items-center justify-center text-xl transition-all duration-150 transform hover:-translate-y-1 active:translate-y-0 border-3 shadow-md focus:outline-none cursor-pointer ${
              btn.isUsed
                ? "opacity-0 scale-50 pointer-events-none" // completely disappears when clicked
                : "bg-white border-pink-200 hover:border-pink-400 text-pink-600 active:bg-pink-100 active:scale-95 hover:shadow-lg"
            }`}
          >
            {btn.char}
          </button>
        ))}
      </div>

      {/* Guidance info line */}
      <p className="text-center text-xs text-pink-400 font-medium">
        💡 點錯了上面的粉色字母可以退回去喔！試試看！
      </p>
    </div>
  );
}
