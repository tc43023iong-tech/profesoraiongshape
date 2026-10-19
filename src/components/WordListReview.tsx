import React, { useState } from "react";
import { Word, WORD_LIST, CHAPTERS, SHAPE_RULES, FOOD_WORDS } from "../data";
import { Search, Volume2, BookOpen, Star, Sparkles, Utensils, Compass, Link2, HelpCircle, ArrowLeft } from "lucide-react";
import { playCorrectSound, playIncorrectSound, speakPortuguese } from "../utils/sound";

interface WordListReviewProps {
  onBack: () => void;
  onSelectChapter?: (chapter: string) => void;
}

type TabMode = "library" | "food_party" | "classroom_detective" | "tail_match" | "rules";

export default function WordListReview({ onBack }: WordListReviewProps) {
  const [activeTab, setActiveTab] = useState<TabMode>("library");
  const [activeChapter, setActiveChapter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<"all" | "m" | "f">("all");
  const [shapeFilter, setShapeFilter] = useState<"all" | "circle" | "square" | "rectangle">("all");

  // Game 1: Food Party State
  const [selectedFood1, setSelectedFood1] = useState<Word>(FOOD_WORDS[0]);
  const [selectedFood2, setSelectedFood2] = useState<Word>(FOOD_WORDS[1] || FOOD_WORDS[0]);

  // Game 2: Classroom Detective State
  const [detectiveTarget, setDetectiveTarget] = useState<"redondo" | "redonda" | "quadrado" | "quadrada" | "retangular">("quadrada");
  const [classroomFeedback, setClassroomFeedback] = useState<string | null>(null);

  // Game 3: Tail Match State
  const [tailQuestIdx, setTailQuestIdx] = useState<number>(0);
  const tailNouns = WORD_LIST.filter(w => w.article !== "");
  const currentTailNoun = tailNouns[tailQuestIdx % tailNouns.length];
  const [tailFeedback, setTailFeedback] = useState<string | null>(null);

  // Filtered words for Library
  const filteredWords = WORD_LIST.filter((w) => {
    const matchesChapter = activeChapter === "All" || w.chapter === activeChapter;
    const matchesSearch = 
      w.portuguese.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.chinese.includes(searchQuery) ||
      w.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "all" || w.gender === genderFilter;
    const matchesShape = shapeFilter === "all" || w.shape === shapeFilter;
    return matchesChapter && matchesSearch && matchesGender && matchesShape;
  });

  const generateNewClassroomCommand = () => {
    const targets: ("redondo" | "redonda" | "quadrado" | "quadrada" | "retangular")[] = [
      "redondo", "redonda", "quadrado", "quadrada", "retangular"
    ];
    const picked = targets[Math.floor(Math.random() * targets.length)];
    setDetectiveTarget(picked);
    setClassroomFeedback(null);
    speakPortuguese(`Procurem uma coisa que é ${picked}!`);
  };

  return (
    <div className="w-full bg-[#FFF8E7] p-4 md:p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 border-b-3 border-black pb-4">
        <button
          onClick={onBack}
          className="mario-btn mario-btn-gray px-4 py-2 text-xs md:text-sm text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回菜單</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black font-pixel text-stone-900 drop-shadow flex items-center justify-center gap-2">
            <span>📚 AS FORMAS EM PORTUGUÊS 🌟</span>
          </h2>
          <p className="text-xs text-stone-700 font-bold">
            Profresora Iong 葡語形狀與陰陽性配合 • 詞庫與情境互動
          </p>
        </div>

        <div className="flex items-center gap-1 bg-amber-200 border-2 border-black px-3 py-1.5 rounded-xl font-bold text-xs text-amber-950">
          <span>{WORD_LIST.length} 核心詞彙</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {[
          { id: "library", label: "📖 形狀單詞庫", icon: BookOpen },
          { id: "food_party", label: "🍕 食物形狀派對", icon: Utensils },
          { id: "classroom_detective", label: "🏫 課室大搜查", icon: Compass },
          { id: "tail_match", label: "🧩 接尾巴找朋友", icon: Link2 },
          { id: "rules", label: "💡 陰陽性口訣卡", icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabMode)}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs md:text-sm border-3 transition-all duration-150 cursor-pointer flex items-center gap-1.5 select-none ${
                isActive
                  ? "bg-amber-400 border-black text-black shadow-[3px_3px_0px_#000] scale-103"
                  : "bg-white border-black/40 text-stone-700 hover:bg-stone-100 hover:border-black"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIBRARY */}
      {activeTab === "library" && (
        <div>
          {/* Chapter & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
            {/* Chapters */}
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setActiveChapter(ch)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                    activeChapter === ch
                      ? "bg-[#E52521] border-black text-white shadow-[2px_2px_0px_#000]"
                      : "bg-white border-stone-300 text-stone-700 hover:bg-amber-100"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            {/* Quick Filter: Gender & Shape */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="bg-white border-2 border-black rounded-xl px-2.5 py-1 text-xs font-bold text-stone-800"
              >
                <option value="all">性別: 全部</option>
                <option value="m">陽性 (o ... -o)</option>
                <option value="f">陰性 (a ... -a)</option>
              </select>

              <select
                value={shapeFilter}
                onChange={(e) => setShapeFilter(e.target.value as any)}
                className="bg-white border-2 border-black rounded-xl px-2.5 py-1 text-xs font-bold text-stone-800"
              >
                <option value="all">形狀: 全部</option>
                <option value="circle">圓形 (Redondo/a)</option>
                <option value="square">正方形 (Quadrado/a)</option>
                <option value="rectangle">長方形 (Retangular)</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="搜尋葡語單詞、例句或中文意思..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border-3 border-black focus:outline-none rounded-xl text-stone-900 font-bold placeholder-stone-400 shadow-[3px_3px_0px_#000] text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                onClick={() => {
                  speakPortuguese(word.exampleSentence || word.portuguese);
                  playCorrectSound();
                }}
                className="group cursor-pointer bg-white hover:bg-amber-50 border-3 border-black p-3 rounded-2xl flex flex-col items-center justify-between text-center shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all duration-150 relative overflow-hidden select-none"
              >
                {/* Article / Gender badge */}
                <div className="w-full flex items-center justify-between text-[10px] font-black mb-1">
                  <span className={`px-1.5 py-0.5 rounded border ${
                    word.gender === "m"
                      ? "bg-blue-100 text-blue-900 border-blue-400"
                      : word.gender === "f"
                      ? "bg-pink-100 text-pink-900 border-pink-400"
                      : "bg-amber-100 text-amber-900 border-amber-400"
                  }`}>
                    {word.gender === "m" ? "陽性 (o)" : word.gender === "f" ? "陰性 (a)" : "陰陽同形"}
                  </span>
                  <span className="text-stone-400 font-bold text-[9px]">
                    {word.targetAdj}
                  </span>
                </div>

                <span className="text-4xl my-1 group-hover:scale-120 transition-transform">
                  {word.emoji}
                </span>

                <h3 className="text-sm md:text-base font-black text-stone-900 leading-tight">
                  {word.portuguese}
                </h3>

                <p className="text-[11px] text-stone-600 font-bold my-1">
                  {word.chinese}
                </p>

                {/* Example Sentence Pill */}
                <div className="w-full bg-stone-100 border border-stone-300 rounded-lg p-1 text-[10px] text-stone-700 font-bold mt-1">
                  {word.exampleSentence}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FOOD SHAPE PARTY */}
      {activeTab === "food_party" && (
        <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
          <div className="text-center mb-6">
            <span className="text-5xl animate-bounce inline-block mb-1">🍕🧇🍫</span>
            <h3 className="text-2xl font-black text-amber-900 font-pixel">
              O BANQUETE DAS FORMAS • 美味食物形狀派對
            </h3>
            <p className="text-stone-600 text-xs md:text-sm font-bold mt-1">
              挑選食物卡片，向客人介紹菜單！觀察披薩 (a)、巧克力磚 (o)、餅乾 (a) 的形狀形容詞變化！
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Food 1 selector */}
            <div className="bg-amber-50 border-3 border-amber-400 rounded-2xl p-4">
              <label className="text-xs font-black text-amber-950 block mb-2">
                1️⃣ 選擇第一道派對美食：
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FOOD_WORDS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFood1(f)}
                    className={`p-2 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      selectedFood1.id === f.id
                        ? "bg-amber-400 border-black shadow-[3px_3px_0px_#000] scale-103 font-black"
                        : "bg-white border-stone-300 text-stone-700 hover:bg-amber-100"
                    }`}
                  >
                    <span className="text-3xl block">{f.emoji}</span>
                    <span className="text-xs font-bold block">{f.portuguese}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Food 2 selector */}
            <div className="bg-orange-50 border-3 border-orange-400 rounded-2xl p-4">
              <label className="text-xs font-black text-orange-950 block mb-2">
                2️⃣ 選擇第二道派對美食：
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FOOD_WORDS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFood2(f)}
                    className={`p-2 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      selectedFood2.id === f.id
                        ? "bg-orange-400 border-black shadow-[3px_3px_0px_#000] scale-103 font-black"
                        : "bg-white border-stone-300 text-stone-700 hover:bg-orange-100"
                    }`}
                  >
                    <span className="text-3xl block">{f.emoji}</span>
                    <span className="text-xs font-bold block">{f.portuguese}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Combined Menu Sentence Presentation */}
          <div className="bg-amber-100 border-4 border-black rounded-2xl p-5 text-center shadow-[4px_4px_0px_#000]">
            <span className="text-xs font-pixel text-amber-800 block mb-2">
              MENU SPEECH • 學生菜單介紹台詞
            </span>
            <div className="text-lg md:text-2xl font-black text-stone-900 mb-2">
              "{selectedFood1.exampleSentence.replace(".", "")}, e {selectedFood2.exampleSentence.toLowerCase()}"
            </div>
            <div className="text-xs md:text-sm text-stone-600 font-bold">
              ({selectedFood1.sentenceChinese.replace("。", "")}，而且{selectedFood2.sentenceChinese})
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLASSROOM DETECTIVE */}
      {activeTab === "classroom_detective" && (
        <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
          <div className="text-center mb-6">
            <span className="text-5xl animate-bounce inline-block mb-1">🏫📢🔍</span>
            <h3 className="text-2xl font-black text-blue-900 font-pixel">
              DETETIVE NA SALA DE AULA • 課室大搜查
            </h3>
            <p className="text-stone-600 text-xs md:text-sm font-bold mt-1">
              老師隨機出題指令，學生找到物品後指著並說出完整句子，注意看是 o 還是 a！
            </p>
          </div>

          {/* Teacher Voice Command Box */}
          <div className="bg-blue-50 border-3 border-blue-500 rounded-2xl p-5 mb-6 text-center shadow-[4px_4px_0px_#000]">
            <span className="text-xs font-pixel text-blue-800 block mb-1">TEACHER'S COMMAND</span>
            <h4 className="text-xl md:text-3xl font-black text-blue-950 mb-2">
              "Procurem uma coisa que é {detectiveTarget}!"
            </h4>
            <p className="text-xs md:text-sm text-blue-800 font-bold mb-4">
              (請找一個是【{detectiveTarget}】的東西！)
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={generateNewClassroomCommand}
                className="mario-btn mario-btn-yellow px-5 py-2 text-black font-black flex items-center gap-1.5 cursor-pointer text-xs md:text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>換一個指令題目！</span>
              </button>
            </div>
          </div>

          {/* Classroom objects shelf to answer */}
          <span className="text-xs font-bold text-stone-600 mb-2 block text-center">
            點擊教室裡的物品來回答老師：
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
            {WORD_LIST.filter(w => w.article !== "").slice(0, 12).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.targetAdj === detectiveTarget) {
                    playCorrectSound();
                    speakPortuguese(item.exampleSentence);
                    setClassroomFeedback(`✅ 太棒了！找到【${item.portuguese}】！完整大聲說出來：${item.exampleSentence}`);
                  } else {
                    playIncorrectSound();
                    setClassroomFeedback(`❌ 哎呀！${item.portuguese} 是【${item.targetAdj}】，不符合題目要求的【${detectiveTarget}】喔！`);
                  }
                }}
                className="p-3 bg-stone-50 hover:bg-blue-50 border-2 border-black rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_#000]"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs font-black mt-1">{item.portuguese}</span>
                <span className="text-[10px] text-stone-500 font-bold">{item.chinese}</span>
              </button>
            ))}
          </div>

          {classroomFeedback && (
            <div className="bg-amber-100 border-2 border-black p-3 rounded-xl text-center text-xs md:text-sm font-bold text-stone-800 animate-fade-in">
              {classroomFeedback}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TAIL MATCH (O CASAMENTO DAS LETRAS) */}
      {activeTab === "tail_match" && (
        <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000]">
          <div className="text-center mb-6">
            <span className="text-5xl animate-bounce inline-block mb-1">🧩🎀⚡</span>
            <h3 className="text-2xl font-black text-purple-900 font-pixel">
              O CASAMENTO DAS LETRAS • 形狀找朋友 (接尾巴)
            </h3>
            <p className="text-stone-600 text-xs md:text-sm font-bold mt-1">
              玩「接尾巴」填空卡片：A bola ➔ 配對 redond-a，O sol ➔ 配對 redond-o，遇見 retangular 男生女生都能直接牽手！
            </p>
          </div>

          {/* Current Question Card */}
          <div className="bg-purple-50 border-3 border-purple-500 rounded-3xl p-6 max-w-xl mx-auto text-center shadow-[4px_4px_0px_#000] mb-6">
            <div className="text-6xl mb-2">{currentTailNoun.emoji}</div>
            
            <div className="text-2xl md:text-3xl font-black text-stone-900 mb-1">
              <span>{currentTailNoun.portuguese} é </span>
              <span className="underline decoration-purple-500 decoration-wavy">
                {currentTailNoun.shape === "circle" ? "redond-" : currentTailNoun.shape === "square" ? "quadrad-" : "_____"}
              </span>
              <span className="text-purple-600 font-black">?</span>
            </div>

            <div className="text-xs text-stone-500 font-bold mb-4">
              {currentTailNoun.chinese} • 定冠詞是「{currentTailNoun.article}」，屬於【{currentTailNoun.gender === 'm' ? '陽性' : '陰性'}】
            </div>

            {/* Answer Tails Options */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "-o (陽性)", value: "redondo", isO: true },
                { label: "-a (陰性)", value: "redonda", isA: true },
                { label: "retangular (變形超人 ⭐)", value: "retangular", isRet: true }
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const isCorrect = 
                      (currentTailNoun.shape === "rectangle" && opt.isRet) ||
                      (currentTailNoun.shape === "circle" && ((currentTailNoun.gender === "m" && opt.isO) || (currentTailNoun.gender === "f" && opt.isA))) ||
                      (currentTailNoun.shape === "square" && ((currentTailNoun.gender === "m" && opt.isO) || (currentTailNoun.gender === "f" && opt.isA)));

                    if (isCorrect) {
                      playCorrectSound();
                      speakPortuguese(currentTailNoun.exampleSentence);
                      setTailFeedback(`🎉 太厲害了！正確答案是：${currentTailNoun.exampleSentence}！`);
                      setTimeout(() => {
                        setTailQuestIdx(prev => prev + 1);
                        setTailFeedback(null);
                      }, 2000);
                    } else {
                      playIncorrectSound();
                      setTailFeedback(`❌ 再想一想！定冠詞是「${currentTailNoun.article}」，形狀是【${currentTailNoun.shape}】，應該接哪一個尾巴呢？`);
                    }
                  }}
                  className="mario-btn mario-btn-yellow p-3 text-xs md:text-sm font-black cursor-pointer shadow-[3px_3px_0px_#000]"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {tailFeedback && (
              <div className="mt-4 p-3 bg-white border-2 border-black rounded-xl text-xs md:text-sm font-bold text-stone-800 animate-fade-in">
                {tailFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: RULES AND MOTTO */}
      {activeTab === "rules" && (
        <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-5xl animate-bounce inline-block mb-1">💡🦸‍♂️</span>
            <h3 className="text-2xl font-black text-amber-900 font-pixel">
              形狀與陰陽性配合教學秘籍
            </h3>
            <p className="text-stone-600 text-xs md:text-sm font-bold mt-1">
              口訣在心，考試公開課滿分通關！
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border-3 border-blue-400 p-4 rounded-2xl">
              <h4 className="text-base font-black text-blue-900 flex items-center gap-2 mb-1">
                <span>1️⃣ 陽性結尾 -o 與 陰性結尾 -a 配合</span>
              </h4>
              <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-medium">
                以 <strong>-o</strong> 結尾的形容詞配合陽性名詞（o sol é <strong>redondo</strong> / o quadro é <strong>quadrado</strong>）。<br />
                以 <strong>-a</strong> 結尾的形容詞配合陰性名詞（a bola é <strong>redonda</strong> / a almofada é <strong>quadrada</strong>）。
              </p>
            </div>

            <div className="bg-amber-50 border-3 border-amber-500 p-4 rounded-2xl">
              <h4 className="text-base font-black text-amber-950 flex items-center gap-2 mb-1">
                <span>2️⃣ 單一形式形容詞：retangular 變形超人 ⭐</span>
              </h4>
              <p className="text-xs md:text-sm text-stone-800 leading-relaxed font-medium">
                以 <strong>-ar</strong> 結尾的 retangular，<strong>陰陽性同形</strong>！<br />
                不管是男生 (o telemóvel / o livro) 還是女生 (a régua / a cama)，衣服都不變，都是 <strong>retangular</strong>！
              </p>
            </div>

            <div className="bg-emerald-50 border-3 border-emerald-500 p-4 rounded-2xl text-center">
              <h4 className="text-sm font-black text-emerald-900 mb-1">
                🌟 Profresora Iong 押韻小口訣 🌟
              </h4>
              <div className="text-base md:text-lg font-black text-emerald-950 py-1">
                {SHAPE_RULES.motto}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
