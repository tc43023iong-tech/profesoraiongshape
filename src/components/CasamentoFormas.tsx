import React, { useState, useEffect } from "react";
import { Word, WORD_LIST } from "../data";
import { playSnapSound, playRepelSound, playCorrectSound, speakPortuguese } from "../utils/sound";
import { ArrowLeft, RefreshCw, Sparkles, Volume2, Magnet, CheckCircle2, AlertTriangle, Trophy } from "lucide-react";

interface CasamentoFormasProps {
  onBack: () => void;
}

interface AdjectiveMagnet {
  id: "redondo" | "redonda" | "quadrado" | "quadrada" | "retangular";
  text: string;
  sub: string;
  gender: "m" | "f" | "both";
  pole: "N (陽性)" | "S (陰性)" | "N/S (雙向萬用)";
  poleColor: string;
  bgGradient: string;
  borderClass: string;
}

const MAGNETS: AdjectiveMagnet[] = [
  {
    id: "redondo",
    text: "redondo",
    sub: "圓形 • 陽性 -o",
    gender: "m",
    pole: "N (陽性)",
    poleColor: "bg-blue-600 text-white",
    bgGradient: "from-blue-50 to-blue-100 border-blue-500",
    borderClass: "border-blue-600 text-blue-900"
  },
  {
    id: "redonda",
    text: "redonda",
    sub: "圓形 • 陰性 -a",
    gender: "f",
    pole: "S (陰性)",
    poleColor: "bg-pink-600 text-white",
    bgGradient: "from-pink-50 to-pink-100 border-pink-500",
    borderClass: "border-pink-600 text-pink-900"
  },
  {
    id: "quadrado",
    text: "quadrado",
    sub: "正方形 • 陽性 -o",
    gender: "m",
    pole: "N (陽性)",
    poleColor: "bg-emerald-600 text-white",
    bgGradient: "from-emerald-50 to-emerald-100 border-emerald-500",
    borderClass: "border-emerald-600 text-emerald-900"
  },
  {
    id: "quadrada",
    text: "quadrada",
    sub: "正方形 • 陰性 -a",
    gender: "f",
    pole: "S (陰性)",
    poleColor: "bg-teal-600 text-white",
    bgGradient: "from-teal-50 to-teal-100 border-teal-500",
    borderClass: "border-teal-600 text-teal-900"
  },
  {
    id: "retangular",
    text: "retangular",
    sub: "長方形 • 變形超人 ⭐",
    gender: "both",
    pole: "N/S (雙向萬用)",
    poleColor: "bg-gradient-to-r from-blue-600 via-amber-400 to-pink-600 text-white font-black",
    bgGradient: "from-amber-100 via-yellow-50 to-amber-100 border-amber-500",
    borderClass: "border-amber-600 text-amber-950"
  }
];

export default function CasamentoFormas({ onBack }: CasamentoFormasProps) {
  // Pool of nouns
  const nounsPool = WORD_LIST.filter(w => w.article !== "");
  
  // Current batch of 6 nouns to pair
  const [currentNouns, setCurrentNouns] = useState<Word[]>([]);
  const [selectedNoun, setSelectedNoun] = useState<Word | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ nounId: string; adjId: string; sentence: string }[]>([]);

  // Repulsion shake feedback state
  const [repulsionItem, setRepulsionItem] = useState<{
    noun: Word;
    adj: AdjectiveMagnet;
    message: string;
  } | null>(null);

  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [successSentence, setSuccessSentence] = useState<string | null>(null);

  // Initialize a round with 6 diverse nouns
  const startNewBatch = () => {
    // Pick 2 circle, 2 square, 2 rectangle
    const circles = nounsPool.filter(w => w.shape === "circle").sort(() => Math.random() - 0.5).slice(0, 2);
    const squares = nounsPool.filter(w => w.shape === "square").sort(() => Math.random() - 0.5).slice(0, 2);
    const rects = nounsPool.filter(w => w.shape === "rectangle").sort(() => Math.random() - 0.5).slice(0, 2);
    const mixed = [...circles, ...squares, ...rects].sort(() => Math.random() - 0.5);

    setCurrentNouns(mixed);
    setSelectedNoun(null);
    setMatchedPairs([]);
    setRepulsionItem(null);
    setSuccessSentence(null);
  };

  useEffect(() => {
    startNewBatch();
  }, []);

  // When user attempts to pair selectedNoun with a magnet
  const handleMagnetClick = (magnet: AdjectiveMagnet) => {
    if (!selectedNoun) return;

    // Check if this noun is already matched
    if (matchedPairs.some(p => p.nounId === selectedNoun.id)) return;

    const isMatch = selectedNoun.targetAdj === magnet.id;

    if (isMatch) {
      // Magnetic SNAP!
      playSnapSound();
      const sentence = selectedNoun.exampleSentence;
      speakPortuguese(sentence);

      setSuccessSentence(sentence);
      setMatchedPairs(prev => [...prev, {
        nounId: selectedNoun.id,
        adjId: magnet.id,
        sentence: sentence
      }]);

      setSelectedNoun(null);
      setRepulsionItem(null);
    } else {
      // Magnetic REPULSION (Screen shake & bounce back)
      playRepelSound();
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      let reason = "";
      if (selectedNoun.shape !== magnet.id && !magnet.id.startsWith(selectedNoun.targetAdj.substring(0, 4))) {
        reason = `形狀不符！【${selectedNoun.portuguese}】不是這個形狀喔！`;
      } else if (selectedNoun.gender === "f" && magnet.gender === "m") {
        reason = `同極相斥！【${selectedNoun.portuguese}】是陰性名詞 (a)，不能吸附陽性的 -o (${magnet.text})，應該找陰性的 -a (redonda/quadrada)！`;
      } else if (selectedNoun.gender === "m" && magnet.gender === "f") {
        reason = `同極相斥！【${selectedNoun.portuguese}】是陽性名詞 (o)，不能吸附陰性的 -a (${magnet.text})，應該找陽性的 -o (redondo/quadrado)！`;
      } else {
        reason = `磁極排斥！【${selectedNoun.portuguese}】和【${magnet.text}】無法吸附！`;
      }

      setRepulsionItem({
        noun: selectedNoun,
        adj: magnet,
        message: reason
      });

      setTimeout(() => {
        setRepulsionItem(null);
      }, 3000);
    }
  };

  const isRoundComplete = currentNouns.length > 0 && matchedPairs.length === currentNouns.length;

  return (
    <div className={`w-full bg-[#fdf8f0] p-4 md:p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] relative overflow-hidden transition-transform duration-100 ${screenShake ? "translate-x-1 translate-y-1 rotate-0.5" : ""}`}>
      {/* Background magnetic field styling */}
      <div className="absolute top-2 right-4 text-purple-200/40 text-7xl select-none pointer-events-none">🧲</div>
      <div className="absolute bottom-3 left-4 text-amber-200/40 text-7xl select-none pointer-events-none">⚡</div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 relative z-10 border-b-3 border-black pb-4">
        <button
          onClick={onBack}
          className="mario-btn mario-btn-gray px-4 py-2 text-xs md:text-sm text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回菜單</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black font-pixel text-purple-800 drop-shadow flex items-center justify-center gap-2">
            <span>🧲 O CASAMENTO DAS FORMAS 💍</span>
          </h2>
          <p className="text-xs text-stone-700 font-bold">
            《形狀大聯姻》• 磁力吸附配對：名詞尋找專屬形狀尾巴，同性相斥，異性相吸！
          </p>
        </div>

        <button
          onClick={startNewBatch}
          className="mario-btn mario-btn-yellow px-4 py-2 text-xs md:text-sm text-black flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>換一批單詞</span>
        </button>
      </div>

      {/* Top Banner: Success Sentence or Repulsion Alert */}
      <div className="min-h-12 mb-6 flex items-center justify-center">
        {successSentence && !repulsionItem && (
          <div className="bg-emerald-100 border-3 border-emerald-600 px-5 py-2 rounded-2xl flex items-center gap-3 shadow-[4px_4px_0px_#059669] animate-bounce">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="text-base md:text-lg font-black text-emerald-900">
              {successSentence}
            </span>
          </div>
        )}

        {repulsionItem && (
          <div className="bg-red-100 border-3 border-red-600 px-5 py-2 rounded-2xl flex items-center gap-2 shadow-[4px_4px_0px_#dc2626] animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="text-xs md:text-sm font-bold text-red-900">
              {repulsionItem.message}
            </span>
          </div>
        )}

        {!successSentence && !repulsionItem && (
          <div className="bg-amber-100 border-2 border-dashed border-amber-400 px-4 py-1.5 rounded-xl text-xs text-amber-900 font-bold">
            💡 先在左側點選「名詞卡」，再點右側磁鐵「形容詞」吸附！
          </div>
        )}
      </div>

      {/* Main Two Columns: Left Nouns, Right Adjective Magnets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: 6 Noun Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-pixel text-xs text-stone-800 font-bold flex items-center gap-1.5">
              <span>📦 待配對的名詞卡 ({matchedPairs.length} / {currentNouns.length})</span>
            </h3>
            <span className="text-[11px] text-stone-500 font-semibold">
              注意看定冠詞 o 還是 a
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentNouns.map((noun) => {
              const matched = matchedPairs.find(p => p.nounId === noun.id);
              const isSelected = selectedNoun?.id === noun.id;

              return (
                <div
                  key={noun.id}
                  onClick={() => {
                    if (matched) {
                      speakPortuguese(noun.exampleSentence);
                    } else {
                      setSelectedNoun(noun);
                      speakPortuguese(noun.portuguese);
                    }
                  }}
                  className={`p-3 rounded-2xl border-3 transition-all duration-150 cursor-pointer relative flex flex-col items-center justify-between select-none ${
                    matched
                      ? "bg-emerald-50 border-emerald-500 shadow-sm opacity-90"
                      : isSelected
                      ? "bg-amber-100 border-amber-500 shadow-[4px_4px_0px_#f59e0b] scale-103 ring-4 ring-amber-300"
                      : "bg-white border-black shadow-[4px_4px_0px_#000] hover:bg-stone-50 hover:-translate-y-0.5"
                  }`}
                >
                  {/* Article Tag */}
                  <div className="w-full flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                      noun.gender === "m"
                        ? "bg-blue-100 text-blue-900 border-blue-400"
                        : "bg-pink-100 text-pink-900 border-pink-400"
                    }`}>
                      {noun.gender === "m" ? "阳性 (o)" : "阴性 (a)"}
                    </span>

                    {matched && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    )}
                  </div>

                  {/* Emoji */}
                  <span className="text-4xl my-1 group-hover:scale-110 transition-transform">
                    {noun.emoji}
                  </span>

                  {/* Portuguese Noun */}
                  <div className="text-sm md:text-base font-black text-stone-900 text-center leading-tight">
                    {noun.portuguese}
                  </div>
                  <div className="text-[11px] text-stone-500 font-bold">
                    {noun.chinese}
                  </div>

                  {/* Matched Suffix Pill */}
                  {matched ? (
                    <div className="mt-2 text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span>é {matched.adjId}!</span>
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-stone-400 font-semibold flex items-center gap-1">
                      <Magnet className="w-3 h-3" />
                      <span>{isSelected ? "已選定" : "點擊選擇"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5 Magnetic Shape Bubbles (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-pixel text-xs text-stone-800 font-bold flex items-center gap-1.5">
              <span>🧲 磁力形容詞泡泡</span>
            </h3>
            <span className="text-[11px] text-stone-500 font-semibold">
              配對後自動朗讀
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {MAGNETS.map((mag) => {
              const isRetangular = mag.id === "retangular";

              return (
                <button
                  key={mag.id}
                  onClick={() => handleMagnetClick(mag)}
                  className={`w-full p-3.5 rounded-2xl border-3 ${mag.borderClass} bg-gradient-to-r ${mag.bgGradient} shadow-[4px_4px_0px_#000] hover:scale-101 active:scale-98 transition-all flex items-center justify-between cursor-pointer relative overflow-hidden group select-none`}
                >
                  {/* Left Magnet Polarity Indicator */}
                  <div className="flex items-center gap-3">
                    <div className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-sm flex items-center gap-1 ${mag.poleColor}`}>
                      <Magnet className="w-3.5 h-3.5" />
                      <span>{mag.pole}</span>
                    </div>

                    <div className="text-left">
                      <div className="text-lg font-black tracking-tight flex items-center gap-1.5">
                        <span>{mag.text}</span>
                        {isRetangular && (
                          <span className="text-xs bg-yellow-400 border border-black text-black px-1.5 py-0.2 rounded font-black animate-pulse">
                            超人 ⭐
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-stone-600">
                        {mag.sub}
                      </div>
                    </div>
                  </div>

                  {/* Action prompt */}
                  <div className="text-right">
                    <span className="text-xs font-bold px-2 py-1 bg-white/80 border border-black/20 rounded-lg group-hover:bg-white text-stone-700">
                      吸附 ➔
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Educational Formula Box */}
          <div className="bg-amber-50 border-3 border-amber-300 rounded-2xl p-3 text-xs text-amber-900 leading-relaxed font-medium mt-1">
            <span className="font-black text-amber-950 block mb-0.5">💡 磁力口訣速記：</span>
            • 陽性名詞 (<span className="text-blue-700 font-bold">o ...</span>) ➔ 搭配 <span className="font-bold">redond-o / quadrad-o</span>！<br />
            • 陰性名詞 (<span className="text-pink-700 font-bold">a ...</span>) ➔ 搭配 <span className="font-bold">redond-a / quadrad-a</span>！<br />
            • 長方形超人 (<span className="text-amber-700 font-bold">retangular</span>) ➔ 男生女生通通吸得牢！
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isRoundComplete && (
        <div className="mt-8 bg-emerald-50 border-4 border-emerald-600 rounded-3xl p-6 text-center max-w-lg mx-auto shadow-[6px_6px_0px_#000] animate-fade-in relative z-20">
          <div className="text-5xl mb-2 animate-bounce">🎉💍✨</div>
          <h3 className="text-2xl font-black text-emerald-800 font-pixel mb-1">
            CASAMENTO PERFEITO!
          </h3>
          <p className="text-emerald-700 text-sm font-bold mb-4">
            恭喜！所有名詞和形狀尾巴都順利牽手成功！
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={startNewBatch}
              className="mario-btn mario-btn-yellow px-6 py-2.5 text-black font-black flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>再玩一組</span>
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
