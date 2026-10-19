import React, { useState, useEffect } from "react";
import { Word, WORD_LIST } from "../data";
import { playCorrectSound, playIncorrectSound, playKeyFoundSound, speakPortuguese } from "../utils/sound";
import { ArrowLeft, RefreshCw, Volume2, Search, Key, DoorClosed, Lock, Unlock, CheckCircle2, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

interface DetetiveDasPalavrasProps {
  onBack: () => void;
}

interface RoomObject {
  id: string;
  name: string;
  chinese: string;
  emoji: string;
  gender: "m" | "f";
  article: "o" | "a";
  shape: "circle" | "square" | "rectangle";
  targetAdj: "redondo" | "redonda" | "quadrado" | "quadrada" | "retangular";
  sentence: string;
  xPos: string; // for room layout
  yPos: string;
  locationLabel: string;
}

const ROOM_OBJECTS: RoomObject[] = [
  {
    id: "quadro",
    name: "o quadro",
    chinese: "畫框",
    emoji: "🖼️",
    gender: "m",
    article: "o",
    shape: "square",
    targetAdj: "quadrado",
    sentence: "O quadro é quadrado.",
    xPos: "left-[18%]",
    yPos: "top-[20%]",
    locationLabel: "牆上的正方形畫框"
  },
  {
    id: "almofada",
    name: "a almofada",
    chinese: "抱枕",
    emoji: "🛋️",
    gender: "f",
    article: "a",
    shape: "square",
    targetAdj: "quadrada",
    sentence: "A almofada é quadrada.",
    xPos: "left-[24%]",
    yPos: "top-[64%]",
    locationLabel: "沙發上的舒適抱枕"
  },
  {
    id: "relogio",
    name: "o relógio",
    chinese: "掛鐘",
    emoji: "⏰",
    gender: "m",
    article: "o",
    shape: "circle",
    targetAdj: "redondo",
    sentence: "O relógio é redondo.",
    xPos: "left-[48%]",
    yPos: "top-[16%]",
    locationLabel: "牆上的圓形掛鐘"
  },
  {
    id: "pizza",
    name: "a pizza",
    chinese: "披薩",
    emoji: "🍕",
    gender: "f",
    article: "a",
    shape: "circle",
    targetAdj: "redonda",
    sentence: "A pizza é redonda.",
    xPos: "left-[50%]",
    yPos: "top-[68%]",
    locationLabel: "茶几上的美味披薩"
  },
  {
    id: "livro",
    name: "o livro",
    chinese: "書本",
    emoji: "📖",
    gender: "m",
    article: "o",
    shape: "rectangle",
    targetAdj: "retangular",
    sentence: "O livro é retangular.",
    xPos: "left-[75%]",
    yPos: "top-[25%]",
    locationLabel: "書架上的精裝書"
  },
  {
    id: "regua",
    name: "a régua",
    chinese: "長尺",
    emoji: "📏",
    gender: "f",
    article: "a",
    shape: "rectangle",
    targetAdj: "retangular",
    sentence: "A régua é retangular.",
    xPos: "left-[78%]",
    yPos: "top-[62%]",
    locationLabel: "書桌上的量尺"
  },
  {
    id: "cubo_magico",
    name: "o cubo mágico",
    chinese: "魔方",
    emoji: "🎲",
    gender: "m",
    article: "o",
    shape: "square",
    targetAdj: "quadrado",
    sentence: "O cubo mágico é quadrado.",
    xPos: "left-[36%]",
    yPos: "top-[70%]",
    locationLabel: "地毯上的魔方"
  },
  {
    id: "moeda",
    name: "a moeda",
    chinese: "幸運硬幣",
    emoji: "🪙",
    gender: "f",
    article: "a",
    shape: "circle",
    targetAdj: "redonda",
    sentence: "A moeda é redonda.",
    xPos: "left-[64%]",
    yPos: "top-[72%]",
    locationLabel: "桌上的金黃硬幣"
  }
];

interface ClueQuest {
  step: number;
  ptCommand: string;
  zhCommand: string;
  requiredAdj: "quadrada" | "redondo" | "retangular";
  hint: string;
}

const QUESTS: ClueQuest[] = [
  {
    step: 1,
    ptCommand: "Procura um objeto que é quadrada!",
    zhCommand: "尋找一個正方形且為陰性 (a ...) 的物品！",
    requiredAdj: "quadrada",
    hint: "提示：注意是 quadrada (-a 陰性)，雖然畫框 (o quadro) 也是正方形，但它是陽性喔！試試看沙發抱枕？"
  },
  {
    step: 2,
    ptCommand: "Procura um objeto que é redondo!",
    zhCommand: "尋找一個圓形且為陽性 (o ...) 的物品！",
    requiredAdj: "redondo",
    hint: "提示：注意是 redondo (-o 陽性)，抬頭看看牆上的時鐘 (o relógio)？"
  },
  {
    step: 3,
    ptCommand: "Procura um objeto que é retangular!",
    zhCommand: "尋找一個長方形物品（變形超人）！",
    requiredAdj: "retangular",
    hint: "提示：長方形是變形超人，不分陰陽性！書本 (o livro) 或長尺 (a régua) 都可以！"
  }
];

export default function DetetiveDasPalavras({ onBack }: DetetiveDasPalavrasProps) {
  const [currentQuestIdx, setCurrentQuestIdx] = useState<number>(0);
  const [collectedKeys, setCollectedKeys] = useState<number>(0);
  const [inspectionModal, setInspectionModal] = useState<{
    show: boolean;
    obj: RoomObject;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  // Boss Stage State
  const [isBossStage, setIsBossStage] = useState<boolean>(false);
  const [selectedRune, setSelectedRune] = useState<string | null>(null);
  const [bossDoorUnlocked, setBossDoorUnlocked] = useState<boolean>(false);
  const [bossFeedback, setBossFeedback] = useState<string | null>(null);

  const currentQuest = QUESTS[currentQuestIdx];

  const playSpeakerCommand = () => {
    if (isBossStage) {
      speakPortuguese("A porta é retangular.");
    } else if (currentQuest) {
      speakPortuguese(currentQuest.ptCommand);
    }
  };

  useEffect(() => {
    // Play speaker prompt on step start
    playSpeakerCommand();
  }, [currentQuestIdx, isBossStage]);

  // Click on a room object
  const handleInspectObject = (obj: RoomObject) => {
    if (isBossStage) return;

    const quest = currentQuest;
    const isTarget = obj.targetAdj === quest.requiredAdj;

    if (isTarget) {
      // Correct!
      playKeyFoundSound();
      speakPortuguese(obj.sentence);

      setInspectionModal({
        show: true,
        obj,
        isCorrect: true,
        explanation: `太棒了！${obj.name} 完美符合！完整句子：${obj.sentence}。物品下方掉出了一把閃亮金鑰匙 🗝️！`
      });

      const newKeys = collectedKeys + 1;
      setCollectedKeys(newKeys);

      setTimeout(() => {
        if (currentQuestIdx < QUESTS.length - 1) {
          setCurrentQuestIdx(prev => prev + 1);
        } else {
          // Trigger Boss Room Stage!
          setIsBossStage(true);
        }
      }, 2500);
    } else {
      // Wrong! Rich pedagogical differentiation feedback
      playIncorrectSound();
      let explanation = "";

      if (quest.requiredAdj === "quadrada" && obj.id === "quadro") {
        explanation = "畫框確實是正方形，但它是「o quadro（陽性）」，應該配「quadrado」，不是題目要求的陰性「quadrada」喔！";
      } else if (quest.requiredAdj === "redondo" && obj.id === "pizza") {
        explanation = "披薩確實是圓形，但它是「a pizza（陰性）」，應該配「redonda」，不是題目要求的陽性「redondo」喔！";
      } else if (obj.shape !== "rectangle" && quest.requiredAdj === "retangular") {
        explanation = `這個物品不是長方形！它需要配【${obj.targetAdj}】。`;
      } else if (obj.gender === "m" && quest.requiredAdj.endsWith("a")) {
        explanation = `注意！${obj.name} 是陽性名詞 (o)，不能配以 -a 結尾的【${quest.requiredAdj}】！`;
      } else if (obj.gender === "f" && quest.requiredAdj.endsWith("o")) {
        explanation = `注意！${obj.name} 是陰性名詞 (a)，不能配以 -o 結尾的【${quest.requiredAdj}】！`;
      } else {
        explanation = `${obj.name} 的形狀是【${obj.targetAdj}】，與線索不符喔！`;
      }

      setInspectionModal({
        show: true,
        obj,
        isCorrect: false,
        explanation
      });
    }
  };

  // Boss door puzzle submission
  const handleInsertRune = (rune: string) => {
    setSelectedRune(rune);

    if (rune === "retangular") {
      playCorrectSound();
      speakPortuguese("A porta é retangular.");
      setBossDoorUnlocked(true);
      setBossFeedback("封印解除！大門緩緩開啟：A porta é retangular！長方形變形超人萬用同形！");
    } else {
      playIncorrectSound();
      setBossFeedback(`符石彈開了！大門是長方形的，不能填【${rune}】喔！回想一下長方形口訣？`);
    }
  };

  const handleRestart = () => {
    setCurrentQuestIdx(0);
    setCollectedKeys(0);
    setIsBossStage(false);
    setSelectedRune(null);
    setBossDoorUnlocked(false);
    setBossFeedback(null);
    setInspectionModal(null);
  };

  return (
    <div className="w-full bg-[#201d2d] text-white p-4 md:p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] relative overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 border-b-2 border-stone-700 pb-3">
        <button
          onClick={onBack}
          className="mario-btn mario-btn-gray px-4 py-2 text-xs md:text-sm text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回菜單</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black font-pixel text-amber-400 drop-shadow flex items-center justify-center gap-2">
            <span>🔍 DETETIVE DAS PALAVRAS 🗝️</span>
          </h2>
          <p className="text-xs text-amber-200 font-bold">
            《名詞密室大逃脫》• 聽聲辨詞，找出隱藏在家具中的密碼鑰匙！
          </p>
        </div>

        {/* Collected Keys Display */}
        <div className="flex items-center gap-2 bg-stone-900 border-2 border-amber-500 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#000]">
          <span className="text-xs font-pixel text-amber-400">KEYS:</span>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Key
                key={i}
                className={`w-5 h-5 ${i < collectedKeys ? "text-amber-400 fill-amber-400 animate-bounce" : "text-stone-600"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loudspeaker Broadcast Clue Card */}
      {!isBossStage && (
        <div className="bg-gradient-to-r from-amber-900/80 via-stone-800 to-amber-900/80 border-3 border-amber-500 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 bg-amber-500 text-black rounded-2xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] shrink-0"
            >
              <Search className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-pixel bg-amber-400 text-black px-2 py-0.5 rounded font-black">
                  CLUE #{currentQuest.step}
                </span>
                <span className="text-xs text-amber-300 font-bold">牆上揚聲器傳出聲音：</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white mt-1">
                "{currentQuest.ptCommand}"
              </h3>
              <p className="text-xs text-stone-300 font-medium">
                {currentQuest.zhCommand}
              </p>
            </div>
          </div>

          <div className="bg-black/50 p-2.5 rounded-xl border border-amber-500/50 max-w-xs text-xs text-amber-200">
            <span className="font-bold text-yellow-300 block mb-0.5">💡 偵探提示本：</span>
            {currentQuest.hint}
          </div>
        </div>
      )}

      {/* Room Investigation Scene */}
      {!isBossStage && (
        <div className="relative w-full h-[400px] md:h-[460px] bg-gradient-to-b from-[#2a223f] to-[#171324] border-4 border-black rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Room Wallpaper & Flooring */}
          <div className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(#3a2e5c_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-stone-900 border-t-4 border-amber-950 flex flex-col justify-end">
            {/* Wooden Floor Planks lines */}
            <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,#000,#000_40px,#3d2c1d_40px,#3d2c1d_80px)]" />
          </div>

          {/* Interactive Objects Placed in Room */}
          {ROOM_OBJECTS.map((obj) => (
            <button
              key={obj.id}
              onClick={() => handleInspectObject(obj)}
              className={`absolute ${obj.xPos} ${obj.yPos} group -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-stone-900/80 hover:bg-amber-900/90 border-2 border-stone-600 hover:border-amber-400 shadow-[4px_4px_0px_#000] transition-all hover:scale-115 active:scale-95 cursor-pointer z-10 flex flex-col items-center select-none`}
            >
              <span className="text-4xl md:text-5xl drop-shadow group-hover:rotate-6 transition-transform">
                {obj.emoji}
              </span>

              {/* Tag Label */}
              <div className="mt-1 px-2 py-0.5 rounded-md bg-black/80 border border-stone-500 group-hover:border-amber-400 text-[10px] md:text-xs font-black text-amber-300 whitespace-nowrap">
                {obj.name}
              </div>

              <span className="text-[9px] text-stone-400 group-hover:text-white font-medium">
                {obj.chinese}
              </span>
            </button>
          ))}

          {/* Exit door in the center background */}
          <div className="absolute top-[30%] left-[8%] -translate-y-1/2 flex flex-col items-center opacity-85 pointer-events-none">
            <DoorClosed className="w-16 h-24 text-amber-700" />
            <span className="text-[10px] font-pixel text-stone-400">BOSS DOOR</span>
          </div>
        </div>
      )}

      {/* Modal Inspector Feedback */}
      {inspectionModal?.show && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className={`p-6 rounded-3xl border-4 border-black max-w-md w-full shadow-[8px_8px_0px_#000] text-center ${
            inspectionModal.isCorrect ? "bg-emerald-950 text-white" : "bg-stone-900 text-white"
          }`}>
            <div className="text-5xl mb-2 animate-bounce">
              {inspectionModal.isCorrect ? "🗝️" : "🔎"}
            </div>

            <h3 className={`text-xl font-black font-pixel mb-1 ${
              inspectionModal.isCorrect ? "text-emerald-400" : "text-amber-400"
            }`}>
              {inspectionModal.isCorrect ? "KEY FOUND! 獲得鑰匙！" : "偵探線索分析"}
            </h3>

            <div className="text-sm font-bold text-stone-300 mb-3">
              調查物品：<span className="text-yellow-300 font-black">{inspectionModal.obj.name}</span> ({inspectionModal.obj.chinese})
            </div>

            <p className="text-xs md:text-sm text-stone-200 mb-6 leading-relaxed bg-black/40 p-3 rounded-xl border border-stone-700">
              {inspectionModal.explanation}
            </p>

            <button
              onClick={() => setInspectionModal(null)}
              className="mario-btn mario-btn-yellow px-6 py-2.5 text-black font-black cursor-pointer"
            >
              明白，繼續調查！
            </button>
          </div>
        </div>
      )}

      {/* Boss Stage: The Final Locked Stone Door */}
      {isBossStage && (
        <div className="bg-stone-900 border-4 border-amber-500 rounded-3xl p-6 md:p-8 text-center max-w-2xl mx-auto shadow-2xl relative z-20">
          <div className="text-5xl mb-2 animate-pulse">
            {bossDoorUnlocked ? "🚪✨" : "🔒"}
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-amber-400 font-pixel mb-1">
            BOSS關卡：終極密室大門
          </h3>
          <p className="text-stone-300 text-xs md:text-sm mb-6">
            三把金鑰匙已集齊！門上的魔法鎖槽刻著一道形狀銘文：
          </p>

          {/* Door Inscription Box */}
          <div className="bg-stone-950 border-3 border-amber-600 rounded-2xl p-5 mb-6 shadow-inner">
            <span className="text-xs font-pixel text-amber-500 block mb-2">DOOR INSCRIPTION</span>
            <div className="text-2xl md:text-3xl font-black text-yellow-300 tracking-wide flex items-center justify-center gap-3">
              <span>A porta é</span>
              <span className={`px-4 py-1 rounded-xl border-2 border-dashed ${
                selectedRune === "retangular" 
                  ? "bg-amber-400 text-black border-amber-300 font-black scale-105" 
                  : "bg-stone-800 text-stone-500 border-stone-600"
              }`}>
                {selectedRune || "________"}
              </span>
              <span>.</span>
            </div>
            <div className="text-xs text-stone-400 mt-2">
              (大門是長方形的，不管是男生還是女生的長方形，結尾都是？)
            </div>
          </div>

          {/* Boss Feedback alert */}
          {bossFeedback && (
            <div className={`p-3 rounded-xl border-2 mb-6 text-xs md:text-sm font-bold ${
              bossDoorUnlocked 
                ? "bg-emerald-950 border-emerald-500 text-emerald-300" 
                : "bg-red-950 border-red-500 text-red-300"
            }`}>
              {bossFeedback}
            </div>
          )}

          {/* Rune Stones in inventory */}
          {!bossDoorUnlocked ? (
            <div>
              <span className="text-xs font-bold text-stone-400 mb-2 block">
                從你的偵探背包中選取形狀符石鑲嵌：
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "redondo", label: "redondo", note: "圓形 (陽性)" },
                  { id: "redonda", label: "redonda", note: "圓形 (陰性)" },
                  { id: "quadrada", label: "quadrada", note: "正方形 (陰性)" },
                  { id: "retangular", label: "retangular", note: "長方形 (超人萬用 ⭐)" }
                ].map((rune) => (
                  <button
                    key={rune.id}
                    onClick={() => handleInsertRune(rune.id)}
                    className="p-3 rounded-2xl border-3 border-amber-400 bg-amber-500/10 hover:bg-amber-500 hover:text-black transition-all cursor-pointer shadow-[3px_3px_0px_#000] flex flex-col items-center select-none"
                  >
                    <span className="text-base font-black">{rune.label}</span>
                    <span className="text-[10px] opacity-80">{rune.note}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="text-6xl mb-3">🎓🏆🏅</div>
              <h4 className="text-xl md:text-2xl font-black text-yellow-300 font-pixel mb-2">
                PARABÉNS! 成功逃脫！
              </h4>
              <p className="text-xs md:text-sm text-stone-200 mb-6 max-w-md mx-auto">
                你成功破解了所有形狀與名詞陰陽性謎題，獲頒【葡語形狀特級小偵探】徽章！
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="mario-btn mario-btn-yellow px-6 py-2.5 text-black font-black flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>再玩一次密室</span>
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
      )}
    </div>
  );
}
