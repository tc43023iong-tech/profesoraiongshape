import React, { useState, useEffect, useRef } from "react";
import { Word, WORD_LIST, CHAPTERS, filterWordsByChapter } from "../data";
import { playCorrectSound, playIncorrectSound, playTugWinSound } from "../utils/sound";
import { ArrowLeft, RefreshCw, Star, Trophy, Volume2, Sparkles, Check, Delete, Award, Heart } from "lucide-react";
import MarioCharacterSprite from "./MarioCharacterSprite";

function BowserMinion({ type, size = 36 }: { type: "goomba" | "bobomb" | "koopa" | "bullet"; size?: number }) {
  if (type === "goomba") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className="drop-shadow" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head/Body of Goomba */}
        <path d="M6 18C6 11 10 8 16 8C22 8 26 11 26 18C26 21 24 23 21 23H11C8 23 6 21 6 18Z" fill="#A0522D" stroke="black" strokeWidth="2" />
        {/* Face background */}
        <path d="M9 17C9 14 11 13 16 13C21 13 23 14 23 17C23 20 20 21 16 21C12 21 9 20 9 17Z" fill="#FFE4C4" />
        {/* Angry Eyebrows */}
        <path d="M10 11L14 13.5" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 11L18 13.5" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        {/* Eyes */}
        <rect x="12" y="14" width="2" height="4" fill="black" />
        <rect x="18" y="14" width="2" height="4" fill="black" />
        {/* Fangs */}
        <path d="M12 21L13 18L14 21" fill="white" stroke="black" strokeWidth="1" />
        <path d="M20 21L19 18L18 21" fill="white" stroke="black" strokeWidth="1" />
        {/* Feet */}
        <ellipse cx="11" cy="25" rx="4" ry="2" fill="#000000" />
        <ellipse cx="21" cy="25" rx="4" ry="2" fill="#000000" />
      </svg>
    );
  }
  if (type === "bobomb") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className="drop-shadow" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fuse */}
        <path d="M16 8V4" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
        {/* Spark */}
        <circle cx="16" cy="3" r="2" fill="yellow" />
        {/* Body circle */}
        <circle cx="16" cy="18" r="8" fill="#2C2C2C" stroke="black" strokeWidth="2" />
        {/* Eyes */}
        <rect x="13" y="14" width="2" height="5" rx="1" fill="white" />
        <rect x="17" y="14" width="2" height="5" rx="1" fill="white" />
        {/* Feet */}
        <rect x="9" y="24" width="6" height="3" rx="1.5" fill="#FFA500" stroke="black" strokeWidth="1.5" />
        <rect x="17" y="24" width="6" height="3" rx="1.5" fill="#FFA500" stroke="black" strokeWidth="1.5" />
        {/* Wind-up Key */}
        <path d="M8 18H5" stroke="#FFD700" strokeWidth="2" />
        <path d="M5 15C3.5 15 3.5 21 5 21" fill="#FFD700" stroke="black" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "koopa") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className="drop-shadow" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shell */}
        <circle cx="14" cy="20" r="7" fill="#00A24A" stroke="black" strokeWidth="2" />
        <path d="M9 20H19M14 15V25" stroke="white" strokeWidth="1" />
        {/* Head */}
        <circle cx="21" cy="13" r="5" fill="#FED42C" stroke="black" strokeWidth="2" />
        {/* Eye */}
        <circle cx="23" cy="12" r="1.5" fill="black" />
        {/* Nose beak */}
        <path d="M24 13C25 14 26 15 25 16C24 17 22 17 21 16" fill="#FED42C" stroke="black" strokeWidth="1.5" />
        {/* Feet */}
        <rect x="9" y="25" width="4" height="4" rx="1" fill="#FED42C" stroke="black" strokeWidth="1.5" />
        <rect x="15" y="25" width="4" height="4" rx="1" fill="#FED42C" stroke="black" strokeWidth="1.5" />
      </svg>
    );
  }
  // Bullet Bill style
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="drop-shadow" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 11H22C26 11 28 13 28 16C28 19 26 21 22 21H4V11Z" fill="#1A2D37" stroke="black" strokeWidth="2" />
      <path d="M20 13C19 13 18 14 18 16C18 18 19 19 20 19C21 19 22 18 22 16C22 14 21 13 20 13Z" fill="white" />
      <circle cx="20" cy="16" r="1" fill="black" />
      <path d="M12 18C10 18 10 22 13 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MarioCloud({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={`drop-shadow-sm select-none pointer-events-none ${className}`} style={style} width="76" height="40" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 12H12V16H8V20H4V28H60V20H56V16H52V12H44V8H36V4H28V8H20V12H16Z" fill="#D3EDFF" />
      <path d="M16 10H14V14H10V18H6V26H58V18H54V14H50V10H42V6H34V2H30V6H22V10H16Z" fill="white" />
      <path d="M30 0H34V2H30V0ZM22 4H24V6H22V4ZM34 4H36V6H34V4ZM38 4H42V6H38V4ZM16 8H20V10H16V8ZM44 8H50V10H44V8ZM10 12H14V14H10V12ZM52 12H54V14H52V12ZM6 16H8V18H6V16ZM56 16H58V18H56V16ZM4 20H6V24H4V20ZM58 20H60V24H58V20ZM2 24H4V28H2V24ZM60 24H62V28H60V24ZM2 28H62V30H2V28Z" fill="#000000" />
    </svg>
  );
}

function MarioHill({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={`select-none pointer-events-none ${className}`} style={style} width="90" height="52" viewBox="0 0 96 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 4L8 44V56H88V44L48 4Z" fill="#00A24A" stroke="black" strokeWidth="2" />
      <path d="M48 6L12 42V54H84V42L48 6Z" fill="#54D075" />
      <path d="M48 6V54H84V42L48 6Z" fill="#00A24A" opacity="0.35" />
      {/* Black Cute Eyes */}
      <rect x="42" y="26" width="3.5" height="11" rx="1.5" fill="black" />
      <rect x="50" y="26" width="3.5" height="11" rx="1.5" fill="black" />
      <rect x="42" y="26" width="2" height="4.5" rx="1" fill="white" />
      <rect x="50" y="26" width="2" height="4.5" rx="1" fill="white" />
    </svg>
  );
}

function WarpPipe({ height = 48, width = 36, className = "", style }: { height?: number; width?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`} style={{ width, height, ...style }}>
      {/* Pipe lip */}
      <div className="w-full h-4 bg-[#00A24A] border-2 border-black rounded-sm relative overflow-hidden shadow-[inset_1.5px_1.5px_0px_rgba(255,255,255,0.4)]">
        <div className="absolute left-1 inset-y-0 w-2.5 bg-[#54D075]" />
        <div className="absolute left-4 inset-y-0 w-0.5 bg-[#54D075]" />
        <div className="absolute right-1.5 inset-y-0 w-2 bg-[#007030]" />
      </div>
      {/* Pipe body */}
      <div className="border-x-2 border-b-2 border-black bg-[#008A3E] relative overflow-hidden flex-1 shadow-[inset_1.5px_-1.5px_0px_rgba(0,0,0,0.3)]" style={{ width: width - 4 }}>
        <div className="absolute left-1 inset-y-0 w-2 bg-[#54D075]" />
        <div className="absolute left-3.5 inset-y-0 w-0.5 bg-[#54D075]" />
        <div className="absolute right-1 inset-y-0 w-2.5 bg-[#005020]" />
      </div>
    </div>
  );
}

function BrickBlock({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <div 
      className={`bg-[#D86818] border-2 border-black relative rounded shadow-[inset_1.5px_1.5px_0px_rgba(255,255,255,0.4)] ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black" />
      <div className="absolute top-0 bottom-1/2 left-1/3 w-0.5 bg-black" />
      <div className="absolute top-0 bottom-1/2 left-2/3 w-0.5 bg-black" />
      <div className="absolute top-1/2 bottom-0 left-1/2 w-0.5 bg-black" />
      <div className="absolute top-0.5 left-0.5 right-0.5 h-0.5 bg-[#FFA060] opacity-70" />
      <div className="absolute top-[55%] left-0.5 right-0.5 h-0.5 bg-[#FFA060] opacity-70" />
    </div>
  );
}

function QuestionBlock({ size = 20, isBouncing = false, className = "", isEmpty = false }: { size?: number; isBouncing?: boolean; className?: string; isEmpty?: boolean }) {
  if (isEmpty) {
    // Empty block (solid brown with corner studs)
    return (
      <div 
        className={`bg-[#9C4A00] border-2 border-black rounded relative shadow-[inset_1.5px_1.5px_0px_rgba(255,255,255,0.2)] ${
          isBouncing ? "animate-question-bounce" : ""
        } ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full opacity-60" />
        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-black rounded-full opacity-60" />
        <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-black rounded-full opacity-60" />
        <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-black rounded-full opacity-60" />
      </div>
    );
  }

  return (
    <div 
      className={`bg-[#FCBC14] border-2 border-black rounded relative select-none flex items-center justify-center shadow-[inset_1.5px_1.5px_0px_white] ${
        isBouncing ? "animate-question-bounce" : "animate-question-shine"
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-black rounded-full" />
      <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-black rounded-full" />
      <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-black rounded-full" />
      <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-black rounded-full" />
      <span className="text-stone-900 font-extrabold text-[11px] leading-tight select-none mt-[-1px] font-sans" style={{ textShadow: "1px 1px 0px #FFEA9F" }}>
        ?
      </span>
    </div>
  );
}

function AnimatedCoin({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div 
      className={`w-4 h-5 bg-[#FCBC14] rounded-full border-2 border-black relative flex items-center justify-center shadow-[inset_1px_1px_0px_white] animate-coin-spin ${className}`}
      style={style}
    >
      <div className="w-[2px] h-2 bg-[#A45000] rounded-sm opacity-50" />
    </div>
  );
}

function PiranhaPlant({ size = 26 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center select-none" style={{ height: 42 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" className="drop-shadow animate-bounce" style={{ animationDuration: "1s" }} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="18" r="9" fill="#E52521" stroke="black" strokeWidth="2" />
        <path d="M7 18H25" stroke="black" strokeWidth="2.5" />
        <path d="M10 18L12 14L14 18L16 14L18 18L20 14L22 18" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="2" fill="white" />
        <circle cx="20" cy="13" r="1.5" fill="white" />
        <circle cx="16" cy="23" r="1.8" fill="white" />
        <rect x="14" y="27" width="4" height="5" fill="#00A24A" stroke="black" strokeWidth="1.5" />
      </svg>
      {/* Mini Pipe container */}
      <div className="w-8 h-4 bg-[#00A24A] border-2 border-black rounded-sm relative -mt-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)] overflow-hidden">
        <div className="absolute left-1 inset-y-0 w-1.5 bg-[#54D075]" />
        <div className="absolute right-1 inset-y-0 w-1 bg-[#007030]" />
      </div>
    </div>
  );
}

const playRetroCoinSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, ctx.currentTime);
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {}
};

interface MarioRunParkourProps {
  onBack: () => void;
}

type GameState = "setup" | "playing" | "hugging";

export default function MarioRunParkour({ onBack }: MarioRunParkourProps) {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  
  // Gameplay words state
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // User input represents sequence of selected scrambled letter objects
  const [userInputSequence, setUserInputSequence] = useState<{ char: string; scrambledId: number }[]>([]);
  
  // Game running states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runSeconds, setRunSeconds] = useState<number>(0);
  const [marioProgress, setMarioProgress] = useState<number>(0); // Current progress 0 - 100
  const [coinCount, setCoinCount] = useState<number>(0);
  const [isWrongAnswer, setIsWrongAnswer] = useState<boolean>(false);
  
  // Scrambled letters as structured objects where each item can be marked used/hidden
  const [scrambledLetters, setScrambledLetters] = useState<{ id: number; char: string; used: boolean }[]>([]);

  // Jumping state
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [jumpText, setJumpText] = useState<string>("");
  
  // Correct word victory jumping state
  const [isCorrectJumping, setIsCorrectJumping] = useState<boolean>(false);

  // Dynamically spawned rolling minions on the path
  const [runningMinions, setRunningMinions] = useState<{
    id: number;
    type: "goomba" | "bobomb" | "koopa" | "bullet";
    progress: number;
    spawnProgress: number;
    isHit: boolean;
    isDodged: boolean;
  }[]>([]);
  
  // Hearts floating list for the final hugging state
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number; delay: number; scale: number }[]>([]);

  // Track checked/shaken question mark blocks
  const [emptiedBlocks, setEmptiedBlocks] = useState<Record<number, boolean>>({});
  const [poppingCoinIndex, setPoppingCoinIndex] = useState<number | null>(null);

  // Unique chapters
  const chapters = CHAPTERS;

  // Shuffle array Helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // Obstacles placed along the 100% path timeline (e.g. at 15%, 35%, 55%, 75%, 95%)
  const OBSTACLES = [
    { progress: 15, emoji: "🍄", name: "栗寶寶 Goomba" },
    { progress: 35, emoji: "🐢", name: "綠龜殼 Shell" },
    { progress: 55, emoji: "🍌", name: "香蕉皮 Banana" },
    { progress: 75, emoji: "🪴", name: "食人花 Plant" },
    { progress: 92, emoji: "🧱", name: "綠水管 Pipe" }
  ];

  // Start game handler
  const handleStartGame = () => {
    // Filter words
    const filtered = filterWordsByChapter(selectedChapter);
    
    // Pick 6 random words
    const shuffled = shuffleArray(filtered);
    const selected = shuffled.slice(0, 6);
    
    // If we have fewer than 6 words, duplicate or fill from others
    while (selected.length < 6 && WORD_LIST.length > 0) {
      const extra = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
      if (!selected.some(w => w.id === extra.id)) {
        selected.push(extra);
      }
    }

    setGameWords(selected);
    setCurrentIndex(0);
    setUserInputSequence([]);
    setIsRunning(false);
    setRunSeconds(0);
    setMarioProgress(0);
    setCoinCount(0);
    setIsWrongAnswer(false);
    setEmptiedBlocks({});
    setPoppingCoinIndex(null);
    
    // Prepare first word scrambled letter pool
    if (selected.length > 0) {
      prepareScrambledLetters(selected[0].english);
    }
    
    setGameState("playing");
  };

  // Prepares scrambled on-screen letter buttons
  const prepareScrambledLetters = (wordStr: string) => {
    const letters = wordStr.toLowerCase().replace(/\s/g, "").split("");
    
    // No decoy letters as requested! Only scramble the original letters of the word.
    const blended = [...letters];
    const shuffledList = shuffleArray(blended).map((char, index) => ({
      id: index,
      char,
      used: false
    }));
    
    setScrambledLetters(shuffledList);
    setUserInputSequence([]);
  };

  const currentWord = gameWords[currentIndex];

  // Trigger jumping mechanism
  const triggerJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    
    const jumpWords = ["HUP! 🦘", "YIPPEE! ⭐", "BOING! 🌟", "JUMP! 💨"];
    setJumpText(jumpWords[Math.floor(Math.random() * jumpWords.length)]);

    // Jump audio tone simulation using Web Audio API if browser supports
    try {
      if (typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "sine";
          // Quick swept frequency sweep up representing NES jump!
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);
          
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      }
    } catch (e) {
      // Ignore audio blockers
    }

    setTimeout(() => {
      setIsJumping(false);
      setJumpText("");
    }, 600); // Jump duration
  };

  // Track key strikes (physical keyboards) and Space to jump
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        triggerJump();
        return;
      }

      if (isRunning) return;

      const key = e.key.toLowerCase();
      // Alpha characters
      if (/^[a-z]$/.test(key)) {
        handleLetterInput(key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Enter") {
        handleSubmitAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userInputSequence, currentWord, gameState, isRunning, scrambledLetters, isJumping]);

  // Setup hearts loop for hugging scene
  useEffect(() => {
    if (gameState === "hugging") {
      const hearts = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: Math.random() * 80 + 10, // 10% to 90% wide
        delay: Math.random() * 4, // 0 to 4s stagger
        scale: Math.random() * 0.6 + 0.6 // sizing
      }));
      setFloatingHearts(hearts);
    }
  }, [gameState]);

  // Fine-grained running simulation & collision check loop (updates every 50ms for smooth movement)
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalMs = 50;
    const totalCount = gameWords.length || 6;
    const stepSize = 100 / totalCount;
    const totalStepIncrease = stepSize; // progress to gain over 3 seconds
    const increasePerTick = totalStepIncrease / (3000 / intervalMs);

    let localRemainingMs = 3000;

    const timer = setInterval(() => {
      localRemainingMs -= intervalMs;
      
      // Update running seconds counter for UI (runs 3s max)
      setRunSeconds(Math.max(0, Math.ceil(localRemainingMs / 1000)));

      if (localRemainingMs <= 0) {
        clearInterval(timer);
        setIsRunning(false);
        setRunningMinions([]);
        goToNextChallenge();
        return;
      }

      // 1. Move Mario forward smoothly
      setMarioProgress((prev) => {
        const nextProgress = Math.min((currentIndex + 1) * stepSize, prev + increasePerTick);
        
        // 2. Move running minions leftwards (they speed towards Mario)
        setRunningMinions((minions) => {
          return minions.map((m) => {
            if (m.isHit || m.isDodged) return m;

            // Minions walk to the left towards Mario
            const updatedMinionProgress = m.progress - 0.25; 
            
            // Check closeness to Mario to detect active collision (mario is at nextProgress)
            const distance = Math.abs(nextProgress - updatedMinionProgress);

            if (distance < 1.6) {
              // Critical contact point!
              if (isJumping) {
                // Mario gets over it! DODGED!
                setCoinCount((c) => c + 3); // Extra 3 golden coins bonus
                
                // Play extra retro spring beep
                try {
                  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                  if (AudioCtx) {
                    const ctx = new AudioCtx();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(450, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.1);
                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                  }
                } catch (e) {}

                return { ...m, progress: updatedMinionProgress, isDodged: true };
              } else {
                // Mario bumped into Bowser's minion! Stunned visual!
                setCoinCount((c) => Math.max(0, c - 2)); // Deduct 2 gold coins
                
                // Play retro hurt sound
                playIncorrectSound();
                
                return { ...m, progress: updatedMinionProgress, isHit: true };
              }
            }

            return { ...m, progress: updatedMinionProgress };
          });
        });

        return nextProgress;
      });

      // Award a gold coin every second
      if (localRemainingMs % 1000 === 0) {
        setCoinCount((prev) => prev + 1);
      }
      
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, currentIndex, gameWords, isJumping]);

  const handleLetterInput = (char: string, scrambledId?: number) => {
    if (isRunning) return;
    
    const targetClean = currentWord.english.toLowerCase().replace(/\s/g, "");
    if (userInputSequence.length >= targetClean.length) return; // Full

    let assignedId = scrambledId;
    if (assignedId === undefined) {
      // Find the first unused letter matching character in available scrambledLetters list
      const matched = scrambledLetters.find(item => item.char === char && !item.used);
      if (matched) {
        assignedId = matched.id;
      }
    }

    if (assignedId !== undefined) {
      // Make selection disappear from scrambled pool
      setScrambledLetters(prev => prev.map(item => item.id === assignedId ? { ...item, used: true } : item));
      setUserInputSequence(prev => [...prev, { char, scrambledId: assignedId! }]);
    }
    setIsWrongAnswer(false);
  };

  // Click on a slot character returns it to the pool
  const handleRemoveAtIndex = (sequenceIndex: number) => {
    if (isRunning || sequenceIndex < 0 || sequenceIndex >= userInputSequence.length) return;
    
    const targetItem = userInputSequence[sequenceIndex];
    
    // restore to scramble pool
    setScrambledLetters(prev => prev.map(item => item.id === targetItem.scrambledId ? { ...item, used: false } : item));
    
    // update current inputs sequence
    setUserInputSequence(prev => prev.filter((_, idx) => idx !== sequenceIndex));
    setIsWrongAnswer(false);
  };

  const handleBackspace = () => {
    if (isRunning || userInputSequence.length === 0) return;
    handleRemoveAtIndex(userInputSequence.length - 1);
  };

  const handleClear = () => {
    if (isRunning) return;
    setUserInputSequence([]);
    setScrambledLetters(prev => prev.map(item => ({ ...item, used: false })));
    setIsWrongAnswer(false);
  };

  const handleSubmitAnswer = () => {
    if (isRunning || !currentWord) return;

    const spelled = userInputSequence.map(item => item.char).join("");
    const target = currentWord.english.toLowerCase().replace(/\s/g, "");

    if (spelled === target) {
      // SUCCESS!
      playCorrectSound();
      setCoinCount((prev) => prev + 10); // 10 gold coins award
      
      // Hit the Question Block!
      setEmptiedBlocks((prev) => ({ ...prev, [currentIndex]: true }));
      setPoppingCoinIndex(currentIndex);
      playRetroCoinSound();
      setTimeout(() => {
        setPoppingCoinIndex(null);
      }, 1200);
      
      // Trigger spelling victory jump animation using CSS Keyframes!
      setIsCorrectJumping(true);
      setTimeout(() => {
        setIsCorrectJumping(false);
      }, 1500);

      // Calculate start of run & trigger 3s sprint
      setIsRunning(true);
      setRunSeconds(3);
      setIsWrongAnswer(false);

      // SPAWN MINIONS: Set up randomly appearing Bowser minions on the upcoming road ahead!
      const minionTypes: ("goomba" | "bobomb" | "koopa" | "bullet")[] = ["goomba", "bobomb", "koopa", "bullet"];
      const totalCount = gameWords.length || 6;
      const stepSize = 100 / totalCount;
      const startProg = currentIndex * stepSize;
      const endProg = (currentIndex + 1) * stepSize;

      // Place 2 minions between start and end milestones
      const midPoint1 = startProg + (endProg - startProg) * 0.35;
      const midPoint2 = startProg + (endProg - startProg) * 0.70;

      const newMinions = [
        {
          id: Date.now() + 10,
          type: minionTypes[Math.floor(Math.random() * minionTypes.length)],
          progress: midPoint1,
          spawnProgress: midPoint1,
          isHit: false,
          isDodged: false,
        },
        {
          id: Date.now() + 20,
          type: minionTypes[Math.floor(Math.random() * minionTypes.length)],
          progress: midPoint2,
          spawnProgress: midPoint2,
          isHit: false,
          isDodged: false,
        }
      ];

      // Keep them within tracks range
      setRunningMinions(newMinions.filter(m => m.progress < 95));
    } else {
      // WRONG
      playIncorrectSound();
      setIsWrongAnswer(true);
      
      // Small screen vibration effect hint
      setTimeout(() => {
        setIsWrongAnswer(false);
      }, 500);
    }
  };

  const goToNextChallenge = () => {
    const totalCount = gameWords.length || 6;
    const stepSize = 100 / totalCount;
    // Snap progress to the index milestone
    const targetProgress = (currentIndex + 1) * stepSize;
    setMarioProgress(targetProgress);

    if (currentIndex + 1 >= totalCount) {
      // Reached 100% and Peach!
      playTugWinSound();
      setGameState("hugging");
    } else {
      // Next Word!
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setIsWrongAnswer(false);
      if (gameWords[nextIdx]) {
        prepareScrambledLetters(gameWords[nextIdx].english);
      }
    }
  };

  const handleSkipWord = () => {
    if (isRunning) return;
    // Cheat or skipped advances progress instantly but doesn't run and awards 0 coins
    const prevIndex = currentIndex;
    const totalCount = gameWords.length || 6;
    const stepSize = 100 / totalCount;
    const targetProgress = (prevIndex + 1) * stepSize;
    setMarioProgress(targetProgress);

    if (prevIndex + 1 >= totalCount) {
      setGameState("hugging");
    } else {
      setCurrentIndex(prevIndex + 1);
      setIsWrongAnswer(false);
      if (gameWords[prevIndex + 1]) {
        prepareScrambledLetters(gameWords[prevIndex + 1].english);
      }
    }
  };

  // Helper to render placeholder slots beautifully (with undo support)
  const renderSlots = () => {
    if (!currentWord) return null;
    
    let letterCounter = 0;

    return (
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 my-6 select-none">
        {currentWord.english.split(" ").map((subWord, wordIdx) => {
          return (
            <div key={wordIdx} className="flex gap-2.5">
              {subWord.split("").map((char, charIdx) => {
                const currentSequenceIndex = letterCounter;
                letterCounter++; // Track relative letter index in inputs sequence

                const activeSelection = userInputSequence[currentSequenceIndex];
                const displayChar = activeSelection ? activeSelection.char : "";

                return (
                  <button
                    key={charIdx}
                    disabled={isRunning || !displayChar}
                    onClick={() => handleRemoveAtIndex(currentSequenceIndex)}
                    className={`w-11 h-14 border-3 rounded-xl flex items-center justify-center font-sans font-bold text-2xl relative transition-all duration-150 ${
                      displayChar 
                        ? "border-black bg-yellow-100 text-stone-900 shadow-[3px_3px_0px_#000] hover:bg-red-100 hover:text-red-700 active:scale-95 cursor-pointer" 
                        : "border-dashed border-stone-400 bg-stone-50 text-transparent cursor-default"
                    }`}
                    title={displayChar ? "點擊字母或按倒退可以取消重選喔！" : ""}
                  >
                    {displayChar}
                    {/* Subtle lower line for active blank guide */}
                    <div className="absolute bottom-1.5 w-6 h-1 bg-stone-400/50 rounded" />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#FFF8E7] border-4 border-black rounded-3xl p-4 md:p-6 shadow-[8px_8px_0px_#000000] relative overflow-hidden">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b-4 border-black pb-4 mb-5 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="mario-btn mario-btn-red text-[11px] px-3.5 py-1.5 text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回城堡</span>
          </button>
          
          <div>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>Super Mario spelling Parkour! 🏃‍♂️</span>
            </h2>
            <p className="text-stone-500 font-bold text-xs">
              每拼對一個單字，Mario 就會奔跑 3 秒！挑戰 6 關救出碧姬公主並擁抱！ 💖 (可按空白鍵或點跳躍來躲避怪獸喔！)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Global coin dashboard */}
          <div className="flex items-center gap-1.5 bg-[#FFF] border-3 border-black text-stone-900 font-black px-3.5 py-1 rounded-2xl shadow-[2px_2px_0px_#000000]">
            <span className="text-xl animate-spin inline-block">🪙</span>
            <span className="font-pixel text-xs">COINS: <span className="text-amber-500 text-sm">{coinCount}</span></span>
          </div>
        </div>
      </div>

      {/* SETUP VIEW: Category options selection */}
      {gameState === "setup" && (
        <div className="py-6 flex flex-col items-center">
          <div className="max-w-xl text-center">
            <div className="text-7xl animate-bounce mb-4 select-none">🏁</div>
            <h3 className="text-2xl font-black text-[#E52521] mb-2 font-pixel">SELECT YOUR SPEEDWAY!</h3>
            <p className="text-stone-600 font-bold text-xs leading-relaxed mb-6">
              Mario 正整裝待發，準備穿越長長的磚塊賽道。
              <br />請先選擇要溫習拼寫的英語聽寫段落：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {chapters.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className={`px-4 py-3.5 border-3 rounded-2xl font-black text-xs md:text-sm text-left transition-all duration-150 ${
                    selectedChapter === ch
                      ? "border-black bg-[#FED42C] text-stone-900 shadow-[4px_4px_0px_#000000] -translate-y-0.5"
                      : "border-stone-350 bg-white text-stone-700 hover:border-black shadow-[2px_2px_0px_#000]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{ch === "All" ? "🌟 全部章節單詞大混戰" : `🍄 ${ch}`}</span>
                    {selectedChapter === ch && <span className="text-sm">🔴</span>}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleStartGame}
              className="mario-btn mario-btn-yellow text-stone-950 px-10 py-5 font-black text-xl flex items-center justify-center gap-3 mx-auto shadow-[6px_6px_0px_#000000] animate-pulse"
            >
              <span>開始冒險 • START RUN! 🚀</span>
            </button>
          </div>
        </div>
      )}

      {/* GAMEPLAY ACTIVE VIEW */}
      {gameState === "playing" && currentWord && (
        <div className="flex flex-col gap-6">

          {/* RETRO 8-BIT RUNNING CANVAS SCREEN */}
          <div className="w-full bg-gradient-to-b from-[#3ea0ff] via-[#5C94FC] to-[#9ad1ff] border-4 border-black rounded-2xl relative h-48 md:h-56 overflow-hidden select-none shadow-[inset_4px_4px_0px_rgba(0,0,0,0.25)]">
            
            {/* Parallax Mountains Layer (Slow scroll relative to progress) */}
            <MarioHill 
              className="absolute bottom-6 transition-all duration-300"
              style={{ left: `calc(10% - (${marioProgress}% * 0.16))` }}
            />
            <MarioHill 
              className="absolute bottom-6 transition-all duration-300 scale-75 origin-bottom opacity-80"
              style={{ left: `calc(48% - (${marioProgress}% * 0.11))` }}
            />
            <MarioHill 
              className="absolute bottom-6 transition-all duration-300 scale-110 origin-bottom"
              style={{ left: `calc(78% - (${marioProgress}% * 0.20))` }}
            />

            {/* Parallax 8-Bit Clouds Layer (Slow scroll) */}
            <MarioCloud 
              className="absolute top-4 transition-all duration-150"
              style={{ left: `calc(12% - (${marioProgress}% * 0.08))` }}
            />
            <MarioCloud 
              className="absolute top-8 scale-75 opacity-70 transition-all duration-150"
              style={{ left: `calc(52% - (${marioProgress}% * 0.05))` }}
            />
            <MarioCloud 
              className="absolute top-2 scale-110 transition-all duration-150"
              style={{ left: `calc(82% - (${marioProgress}% * 0.12))` }}
            />

            {/* Backdrop Shaded Green Decoration Pipes */}
            <WarpPipe 
              height={40} 
              width={32} 
              className="absolute bottom-6 transition-all duration-300 opacity-90"
              style={{ left: `calc(4% + (18% * 0.72))` }}
            />
            <WarpPipe 
              height={50} 
              width={34} 
              className="absolute bottom-6 transition-all duration-300 opacity-90"
              style={{ left: `calc(4% + (65% * 0.72))` }}
            />

            {/* Floating Brick & Question Blocks above stood milestones (0%, 16.6%, 33.3%, 50%, 66.6%, 83.3%) */}
            {Array.from({ length: 6 }).map((_, stageIdx) => {
              const totalCount = gameWords.length || 6;
              const stepSize = 100 / totalCount;
              const stageProgress = stageIdx * stepSize;
              const isEmpty = emptiedBlocks[stageIdx];
              const isPopping = poppingCoinIndex === stageIdx;
              
              // Align left relative to the percentage path
              const leftPos = `calc(4% + (${stageProgress}% * 0.72))`;

              return (
                <div 
                  key={stageIdx}
                  className="absolute bottom-20 z-15 flex items-center gap-0 pointer-events-none"
                  style={{ 
                    left: `calc(${leftPos} - 16px)`, // offset slightly to center of mario's coordinate
                  }}
                >
                  <BrickBlock size={18} />
                  
                  <div className="relative">
                    {/* Popping Gold coin when spelling is correct! */}
                    {isPopping && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-25">
                        <div className="animate-coin-popup flex items-center justify-center">
                          <AnimatedCoin />
                        </div>
                        {/* Sparkles bubble */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-star-burst text-yellow-300 text-xs">
                          ✨
                        </div>
                      </div>
                    )}
                    
                    {/* The Question Mark Block itself */}
                    <QuestionBlock 
                      size={18} 
                      isBouncing={isPopping} 
                      isEmpty={isEmpty}
                    />
                  </div>

                  <BrickBlock size={18} />
                </div>
              );
            })}

            {/* High-fidelity Spinning 3D Coins positioned in beautiful arches */}
            {Array.from({ length: 9 }).map((_, i) => {
              const itemProg = (i + 1) * 10;
              const isCollected = marioProgress >= itemProg;
              // Arch curve height multiplier
              const indexInSubarch = i % 3;
              const archHeight = indexInSubarch === 0 ? 12 : indexInSubarch === 1 ? 26 : 12;
              return (
                <div 
                  key={i} 
                  className="absolute transition-all duration-300 z-10"
                  style={{ 
                    left: `calc(4% + (${itemProg}% * 0.72) + 12px)`,
                    bottom: `${26 + archHeight}px`,
                    opacity: isCollected ? 0 : 1,
                    transform: isCollected ? "translateY(-35px) scale(0.2) rotate(180deg)" : "none"
                  }}
                >
                  <AnimatedCoin />
                </div>
              );
            })}

            {/* Leftmost Retro Pipe Marker */}
            <div className="absolute left-1.5 bottom-6 w-16 h-12 flex items-end pointer-events-none z-10">
              <WarpPipe height={28} width={24} className="opacity-80" />
              <WarpPipe height={42} width={28} className="-ml-1.5" />
            </div>

            {/* Obstacles with dynamic high-fidelity NES styling */}
            {OBSTACLES.map((obs, idx) => {
              const isPassed = marioProgress >= obs.progress;
              // Detect closeness
              const isClose = Math.abs(marioProgress - obs.progress) < 6;
              
              // Custom graphic component map depending on the obstacle
              const renderObstacleGraphic = () => {
                if (obs.name.includes("Goomba")) {
                  return <BowserMinion type="goomba" size={30} />;
                }
                if (obs.name.includes("Shell")) {
                  return <BowserMinion type="koopa" size={30} />;
                }
                if (obs.name.includes("Plant")) {
                  return <PiranhaPlant size={24} />;
                }
                if (obs.name.includes("Pipe")) {
                  return <WarpPipe height={44} width={32} />;
                }
                // Default fallback
                return <span className="text-xl animate-bounce">🍌</span>;
              };

              return (
                <div 
                  key={idx}
                  className="absolute bottom-6 transition-all duration-300 z-10"
                  style={{ left: `calc(4% + (${obs.progress}% * 0.72) + 14px)` }}
                >
                  <div className="flex flex-col items-center select-none relative">
                    {isClose && (
                      <div className="absolute h-5 -top-7 bg-[#E52521] text-white text-[8px] font-black border border-black rounded px-1.5 whitespace-nowrap leading-none flex items-center shadow-lg animate-bounce z-30">
                        {isJumping ? "DODGED! ⭐" : "JUMP QUICK! ⚡"}
                      </div>
                    )}
                    <div 
                      className={`transition-all duration-150 ${
                        isPassed && !isJumping ? "opacity-30 scale-75 rotate-45" : ""
                      }`}
                    >
                      {renderObstacleGraphic()}
                    </div>
                    <span className="text-[7.5px] font-black text-black bg-[#FFEA9F] border border-black rounded px-0.5 scale-75 whitespace-nowrap leading-none mt-1 shadow-sm">
                      {obs.name.split(" ")[0]}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Render dynamically spawned active Bowser Minions! */}
            {runningMinions.map((m) => {
              if (m.isHit) {
                return (
                  <div
                    key={m.id}
                    className="absolute bottom-6 transition-all duration-300 z-30"
                    style={{ left: `calc(4% + (${m.progress}% * 0.72) + 14px)` }}
                  >
                    <div className="flex flex-col items-center relative animate-bounce select-none">
                      <div className="absolute -top-7 px-1.5 py-0.5 bg-red-500 border border-black rounded text-[8px] font-black tracking-tighter text-white animate-pulse whitespace-nowrap leading-none z-30 shadow">
                        OUCH! 💥 -2🪙
                      </div>
                      <div className="rotate-180 opacity-60 scale-75 filter grayscale">
                        <BowserMinion type={m.type} size={36} />
                      </div>
                      <span className="text-[7px] font-black text-red-600 bg-white border border-black rounded px-0.5 scale-75 whitespace-nowrap leading-none">
                        HIT! 🤕
                      </span>
                    </div>
                  </div>
                );
              }

              if (m.isDodged) {
                return (
                  <div
                    key={m.id}
                    className="absolute bottom-6 transition-all duration-300 z-15"
                    style={{ left: `calc(4% + (${m.progress}% * 0.72) + 14px)` }}
                  >
                    <div className="flex flex-col items-center relative select-none">
                      <div className="absolute -top-7 px-1.5 py-0.5 bg-emerald-500 border border-black rounded text-[8px] font-black tracking-tighter text-white whitespace-nowrap leading-none z-30 shadow">
                        DODGED! ⭐ +3🪙
                      </div>
                      <div className="opacity-45 scale-75 -translate-y-2 select-none pointer-events-none">
                        <BowserMinion type={m.type} size={36} />
                      </div>
                      <span className="text-[7px] font-black text-emerald-600 bg-white border border-black rounded px-0.5 scale-75 whitespace-nowrap leading-none">
                        DODGED! 👍
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className="absolute bottom-6 transition-all duration-75 z-20"
                  style={{ left: `calc(4% + (${m.progress}% * 0.72) + 14px)` }}
                >
                  <div className="flex flex-col items-center select-none relative animate-pulse">
                    {Math.abs(marioProgress - m.progress) < 12 && (
                      <div className="absolute -top-6 bg-red-600 text-white text-[8px] font-black border border-black rounded px-1.5 animate-bounce z-40 whitespace-nowrap leading-none">
                        ⚠️ 🦘 SPACE!
                      </div>
                    )}
                    <div className="animate-bounce" style={{ animationDuration: "0.6s" }}>
                      <BowserMinion type={m.type} size={36} />
                    </div>
                    <span className="text-[7px] font-black text-black bg-stone-100 border border-black rounded px-0.5 scale-75 whitespace-nowrap leading-none uppercase">
                      {m.type === "goomba" ? "栗寶寶" : m.type === "bobomb" ? "炸彈兵" : m.type === "koopa" ? "飛龜殼" : "砲彈"}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Princess Peach's Brick Castle Tower Area */}
            <div className="absolute right-1 bottom-6 w-24 h-32 flex flex-col justify-end items-center pointer-events-none z-10">
              {/* Detailed 8-Bit Brick Castle Tower */}
              <div className="w-[72px] bg-[#9C4A00] border-3 border-black h-20 rounded-t-lg relative flex flex-col items-center justify-end shadow-[inset_2px_2px_0px_rgba(255,255,255,0.25)]">
                {/* Battlements / crenels */}
                <div className="absolute -top-[9px] inset-x-0 h-[9px] flex justify-between px-0.5">
                  <div className="w-[16px] h-[9px] bg-[#9C4A00] border-t-3 border-x-3 border-black" />
                  <div className="w-[16px] h-[9px] bg-[#9C4A00] border-t-3 border-x-3 border-black" />
                  <div className="w-[16px] h-[9px] bg-[#9C4A00] border-t-3 border-x-3 border-black" />
                </div>
                {/* Black arched entrance door */}
                <div className="w-8 h-10 bg-stone-900 border-t-3 border-x-3 border-black rounded-t-lg absolute bottom-0 left-1/2 -translate-x-1/2 shadow-inner" />
                
                {/* Star-waving Castle flag rod */}
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-[3px] h-9 bg-stone-700 border border-black rounded-full" />
                  <div className="w-[22px] h-[15px] bg-[#E52521] border-2 border-black absolute top-0 left-[2px] flex items-center justify-center rounded-sm">
                    <span className="text-[7px] text-yellow-300 font-extrabold animate-pulse">⭐</span>
                  </div>
                </div>
              </div>
              
              {/* Princess Peach standing beautifully waiting next to Castle */}
              <div className="absolute right-2.5 bottom-0 h-12 z-20 scale-x-[-1] animate-bounce" style={{ animationDuration: "1.4s" }}>
                <MarioCharacterSprite character="peach" animation="idle" size={28} />
              </div>
            </div>

            {/* High-fidelity 8-Bit Ground Block Terrain */}
            <div className="absolute bottom-0 inset-x-0 h-6 bg-[#C84C0C] border-t-3 border-black z-15 select-none overflow-hidden flex">
              {Array.from({ length: 45 }).map((_, i) => (
                <div key={i} className="flex-1 min-w-[20px] border-r-2 border-black h-full relative" style={{ backgroundColor: "#C84C0C" }}>
                  {/* Top dirt grass edge in SMB-style orange block line */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-[#FC9C14] border-b-2 border-black" />
                  {/* Double joint studs in clay blocks */}
                  <div className="absolute bottom-1 left-0.5 w-1 h-1 bg-black rounded-full opacity-60" />
                  <div className="absolute bottom-1 right-0.5 w-1 h-1 bg-black rounded-full opacity-60" />
                </div>
              ))}
            </div>

            {/* MARIO MAIN RUNNER AVATAR WITH JUMP ANIMATING PHYSICS */}
            <div 
              className={`absolute transition-all duration-1000 ease-out z-20 ${
                isCorrectJumping ? "animate-correct-mario-jump" : ""
              }`}
              style={{ 
                left: `calc(4% + (${marioProgress}% * 0.72))`,
                bottom: isJumping ? "72px" : "22px",
                transform: isJumping ? "rotate(10deg) scale(1.15)" : "none",
                transition: isJumping 
                  ? "bottom 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.18s ease-out" 
                  : "bottom 0.3s ease-in, transform 0.3s ease-in, left 1s ease-out"
              }}
            >
              <div className="flex flex-col items-center relative">
                {/* Correct Victory Jump words bubble */}
                {isCorrectJumping && (
                  <div className="absolute -top-7 px-2 py-0.5 bg-[#FED42C] text-stone-900 border border-black rounded text-[8px] font-black tracking-tighter animate-bounce whitespace-nowrap leading-none z-30 shadow-[1.5px_1.5px_0px_#000]">
                    SUPER SPELLED! 🌟
                  </div>
                )}
                {/* Jump words bubble */}
                {!isCorrectJumping && isJumping && jumpText && (
                  <div className="absolute -top-7 px-1.5 py-0.5 bg-yellow-300 border border-black rounded text-[8px] font-black tracking-tighter text-black animate-bounce whitespace-nowrap leading-none z-30 shadow">
                    {jumpText}
                  </div>
                )}
                {/* Active speed-lines or speech balloon during 3s run */}
                {!isCorrectJumping && !isJumping && isRunning && (
                  <div className="absolute -top-7 px-2 py-0.5 bg-yellow-300 border border-black rounded text-[9px] font-black tracking-tighter text-black animate-bounce whitespace-nowrap leading-none select-none shadow">
                    YAHOO! SPEED RUNNING ({runSeconds}s)
                  </div>
                )}
                
                <MarioCharacterSprite 
                  character="mario" 
                  animation={isCorrectJumping ? "win" : isJumping ? "climb" : isRunning ? "walk" : "idle"} 
                  size={40} 
                />
              </div>
            </div>

            {/* Flag milestone poles helper */}
            <div className="absolute inset-x-12 bottom-4 h-1 flex justify-between pointer-events-none">
              {Array.from({ length: 11 }).map((_, i) => {
                const stepProg = i * 10;
                const isPassed = marioProgress >= stepProg;
                return (
                  <div key={i} className="relative flex flex-col items-center">
                    <div className={`w-0.5 h-3 ${isPassed ? "bg-stone-800" : "bg-stone-400"}`} />
                    {i > 0 && i < 10 && (
                      <span className="absolute -top-4 text-[8px] font-bold text-stone-300">
                        {i}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* PLAYERS PROGRESS STATISTICS */}
          <div className="flex items-center justify-between bg-white border-3 border-black p-3 rounded-2xl shadow-[3px_3px_0px_#000]">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#E52521]">
              <span className="animate-pulse">🚩</span>
              <span>QUEST LIST: <span className="text-stone-900">{currentIndex + 1} / 6 題</span></span>
            </div>
            
            <div className="w-1/2 bg-stone-100 border-2 border-black rounded-lg h-4 relative overflow-hidden flex items-center">
              <div 
                className="bg-yellow-400 border-r-2 border-black h-full transition-all duration-300"
                style={{ width: `${marioProgress}%` }}
              />
              <span className="absolute inset-0 text-[9px] font-black text-center text-stone-900 leading-none flex items-center justify-center">
                MARIO RUN PROGRESS: {Math.round(marioProgress)}%
              </span>
            </div>

            <div className="text-[10px] font-black text-stone-500 flex items-center gap-1">
              <span>Chapter:</span>
              <span className="bg-[#FFF8E7] px-2 py-1 rounded-lg border-2 border-black text-stone-900 font-pixel">
                {currentWord.chapter}
              </span>
            </div>
          </div>

          {/* THE SPELLING WORKSPACE */}
          <div className={`bg-white border-4 border-black rounded-3xl p-5 shadow-[5px_5px_0px_#000] text-center transition-all ${isWrongAnswer ? "animate-shake bg-red-50 border-rose-500" : ""}`}>
            
            {/* Chinese Cue and Emoji display */}
            <div className="inline-block bg-[#FFF8E7] border-3 border-black px-6 py-3.5 rounded-2xl shadow-[3px_3px_0px_#000] mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-3xl">{currentWord.emoji}</span>
                <span className="text-xl md:text-2xl font-black text-stone-900 tracking-wide">
                  {currentWord.chinese}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#E52521] uppercase tracking-wider block">
                請拼出下方單字拼寫 • LOWERCASE
              </span>
            </div>

            {/* Slots guides */}
            {renderSlots()}

            {/* Scrambled Bubble letters board (Fades out chosen letters dynamically) */}
            {!isRunning && (
              <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto mb-6">
                {scrambledLetters.map((item) => (
                  <button
                    key={`${item.char}-${item.id}`}
                    disabled={item.used}
                    onClick={() => handleLetterInput(item.char, item.id)}
                    className={`w-10 h-10 md:w-11 md:h-11 border-2 border-black bg-white rounded-lg flex items-center justify-center text-lg md:text-xl font-black font-sans hover:bg-yellow-200 hover:-translate-y-0.5 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#000] ${
                      item.used ? "opacity-0 pointer-events-none scale-50" : "cursor-pointer"
                    }`}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            )}

            {/* Action Bar controls */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              <button
                onClick={handleClear}
                disabled={isRunning || userInputSequence.length === 0}
                className={`mario-btn mario-btn-yellow text-stone-900 border-2 px-5 py-2.5 text-xs font-black flex items-center gap-1.5 ${userInputSequence.length === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <span>清除全部 🧹</span>
              </button>

              <button
                onClick={handleBackspace}
                disabled={isRunning || userInputSequence.length === 0}
                className={`mario-btn mario-btn-yellow text-stone-900 border-2 px-5 py-2.5 text-xs font-black flex items-center gap-1.5 ${userInputSequence.length === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <Delete className="w-4 h-4" />
                <span>倒退 ⌫</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={isRunning || userInputSequence.length === 0}
                className="mario-btn mario-btn-red text-white border-2 px-8 py-3.5 text-sm font-black flex items-center gap-2 animate-bounce"
              >
                <Check className="w-5 h-5" />
                <span>確認送出 🏁</span>
              </button>

              <button
                type="button"
                onClick={triggerJump}
                className={`mario-btn bg-[#FF8E3C] hover:bg-[#FF7011] text-white border-2 px-6 py-2.5 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:scale-95 transition-all ${
                  isJumping ? "translate-y-0.5" : ""
                }`}
                title="按空白鍵或這裡可以起跳喔！"
              >
                <span>🦘 SPACE 跳躍</span>
              </button>

              <button
                onClick={handleSkipWord}
                disabled={isRunning}
                className="mario-btn bg-[#FFF8E7] hover:bg-[#FED42C] text-stone-800 border-2 border-dashed border-stone-500 px-4 py-2.5 text-xs font-black"
                title="Skip this question"
              >
                <span>跳過此題 ⏩</span>
              </button>
            </div>

            {/* Active Running status banner */}
            {isRunning && (
              <div className="mt-4 p-4 bg-sky-100 border-3 border-black rounded-2xl flex flex-col items-center gap-1 animate-pulse max-w-sm mx-auto">
                <span className="text-2xl animate-bounce">🏃‍♂️💨</span>
                <span className="text-xs font-black text-sky-800">
                  MARIO IS RUNNING FOR {runSeconds} SECONDS!
                </span>
                <span className="text-[10px] font-bold text-stone-500">
                  可以按下空白鍵或點選橘色按鈕在半空中跳躍喔！
                </span>
              </div>
            )}

          </div>

        </div>
      )}

      {/* FINAL REACHED / PRINCES PEACH RESCUED HUGGING CELEBRATION */}
      {gameState === "hugging" && (
        <div className="py-8 text-center flex flex-col items-center relative bg-gradient-to-b from-[#FFF0F5] to-[#FFE4E1] border-4 border-[#FFA6C9] rounded-3xl p-6 shadow-[8px_8px_0px_#FFA6C9]">
          
          {/* Confetti celebration bursts (CSS details) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
            {floatingHearts.map((heart) => (
              <div
                key={heart.id}
                className="absolute text-2xl text-red-500 animate-float-heart"
                style={{
                  left: `${heart.left}%`,
                  bottom: `-10%`,
                  animationDelay: `${heart.delay}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  transform: `scale(${heart.scale})`,
                }}
              >
                💖
              </div>
            ))}
          </div>

          {/* Grand Victory Header Title Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E52521] text-white border-4 border-black px-6 py-2.5 rounded-2xl text-sm md:text-base font-black shadow-[4px_4px_0px_#000] mb-6 z-10">
            <Star className="w-5 h-5 animate-spin text-yellow-300 fill-yellow-250" />
            <span>STAGE COMPLETED • 關卡完美全通！</span>
            <Star className="w-5 h-5 animate-spin text-yellow-300 fill-yellow-250" />
          </div>

          {/* Sweet Hugging stage with Mario and Peach side by side */}
          <div className="w-full max-w-lg bg-[#5C94FC] border-4 border-black rounded-2xl h-44 flex items-end justify-center gap-0 relative p-2 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.3)] z-10 mb-6 overflow-hidden">
            {/* Ground */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-amber-800 border-t-3 border-black z-0" />
            
            {/* Hearts flying from the hug point */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 z-30 pointer-events-none">
              <span className="text-3xl animate-bounce">❤️</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: "150ms" }}>💖</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: "300ms" }}>💕</span>
            </div>

            {/* MARIO AND PEACH SIDE BY SIDE HUGGING */}
            <div className="flex items-end justify-center z-10 gap-0 transform -translate-y-1 scale-125">
              
              {/* Mario win/joy state */}
              <div className="translate-x-1 text-center">
                <span className="text-[10px] block font-black text-black bg-yellow-200 border border-black rounded px-1 scale-75 animate-bounce leading-none">
                  瑪利歐 ❤️
                </span>
                <MarioCharacterSprite character="mario" animation="win" size={36} />
              </div>

              {/* Sweet kiss / heart marker center */}
              <span className="text-2xl animate-pulse self-center z-20 mx-[-4px]">💏</span>

              {/* Princess Peach in happy Win state! */}
              <div className="translate-x-[-4px] text-center scale-x-[-1]">
                <div className="scale-x-[-1]">
                  <span className="text-[10px] block font-black text-pink-600 bg-white border border-pink-300 rounded px-1 scale-75 animate-bounce leading-none">
                    碧姬公主 ❤️
                  </span>
                </div>
                <MarioCharacterSprite character="peach" animation="win" size={36} />
              </div>

            </div>

            {/* Little yellow gold coins background arc */}
            <div className="absolute inset-x-12 top-6 flex justify-between opacity-40">
              <span className="text-xl">🏆</span>
              <span className="text-xl">⭐️</span>
              <span className="text-xl">🌟</span>
              <span className="text-xl">⭐️</span>
              <span className="text-xl">🏆</span>
            </div>
          </div>

          <div className="z-10 max-w-md">
            <h3 className="text-2xl md:text-3xl font-black text-stone-900 mb-2">
              💖 成功救出碧姬公主 💖
            </h3>
            
            <p className="text-[#E12521] font-black text-lg md:text-xl tracking-wide mb-3 animate-pulse">
              公主給了瑪利歐一個溫暖又深情的擁抱！
            </p>

            <div className="bg-white/80 border-3 border-black p-4 rounded-2xl text-xs md:text-sm font-bold text-stone-700 leading-relaxed mb-6 shadow-sm">
              恭喜，你在
              <span className="text-amber-500 font-extrabold px-1 text-base font-pixel">{selectedChapter}</span>
              段落挑戰中，以驚人的毅力連續拼對 6 道聽寫單詞關卡！
              <br />
              一路上拾取了大量的黃金金幣，為瑪利歐王國重新帶來了和平與喜悅！
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleStartGame}
                className="mario-btn mario-btn-red text-white text-xs md:text-sm px-6 py-3 font-black flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>再次挑戰現有段落</span>
              </button>

              <button
                onClick={() => setGameState("setup")}
                className="mario-btn mario-btn-yellow text-stone-900 text-xs md:text-sm px-6 py-3 font-black flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 animate-spin" />
                <span>切換其他單詞段落</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Floating Hearts Animation Keyframes stylesheet injection */}
      <style>{`
        @keyframes floatingHeartsPulse {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          12% { opacity: 1; }
          90% { opacity: 0.9; }
          100% { transform: translateY(-300px) scale(1.1); opacity: 0; }
        }
        .animate-float-heart {
          animation: floatingHeartsPulse 4s linear infinite;
        }

        @keyframes scrollingBgAnim {
          0% { background-position-x: 0px; }
          100% { background-position-x: -60px; }
        }
        .animate-scrolling-bg {
          animation: scrollingBgAnim 1s linear infinite;
        }

        @keyframes correctMarioJump {
          0%, 100% {
            bottom: 22px;
            transform: scale(1) rotate(0deg);
          }
          20% {
            bottom: 72px;
            transform: scale(1.21) rotate(-8deg);
          }
          40% {
            bottom: 104px;
            transform: scale(1.35) rotate(15deg);
          }
          60% {
            bottom: 92px;
            transform: scale(1.28) rotate(-15deg);
          }
          80% {
            bottom: 52px;
            transform: scale(1.1) rotate(5deg);
          }
        }
        .animate-correct-mario-jump {
          animation: correctMarioJump 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes questionShine {
          0%, 100% { background-color: #FCBC14; }
          50% { background-color: #FFEA8A; }
        }
        .animate-question-shine {
          animation: questionShine 0.75s infinite steps(2);
        }

        @keyframes questionBounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
          65% { transform: translateY(2px); }
        }
        .animate-question-bounce {
          animation: questionBounce 0.4s ease-out;
        }

        @keyframes coinSpin {
          0% { transform: scaleX(1); }
          50% { transform: scaleX(0.1); }
          100% { transform: scaleX(1); }
        }
        .animate-coin-spin {
          animation: coinSpin 0.75s infinite linear;
        }

        @keyframes coinPopUp {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          45% {
            transform: translateY(-44px) scale(1.3) rotate(180deg);
            opacity: 1;
          }
          80% {
            transform: translateY(-24px) scale(0.9) rotate(360deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-16px) scale(0.4) rotate(450deg);
            opacity: 0;
          }
        }
        .animate-coin-popup {
          animation: coinPopUp 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes starBurstAnim {
          0% { transform: scale(0) rotate(0); opacity: 0; }
          50% { transform: scale(1.15) rotate(180deg); opacity: 1; }
          100% { transform: scale(0.5) rotate(360deg); opacity: 0; }
        }
        .animate-star-burst {
          animation: starBurstAnim 0.5s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
