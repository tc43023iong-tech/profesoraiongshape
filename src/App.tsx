import React, { useState } from "react";
import Header from "./components/Header";
import WordListReview from "./components/WordListReview";
import EmojiDetective from "./components/EmojiDetective";
import ChMatchMatch from "./components/ChMatchMatch";
import SpellingBee from "./components/SpellingBee";
import WordSearch from "./components/WordSearch";
import MemoryGame from "./components/MemoryGame";
import TugOfWar from "./components/TugOfWar";
import GooseChase from "./components/GooseChase";
import DuoXiaoXiaoLe from "./components/DuoXiaoXiaoLe";
import ClimbLadder from "./components/ClimbLadder";
import MarioRunParkour from "./components/MarioRunParkour";
import FormaFactory from "./components/FormaFactory";
import CasamentoFormas from "./components/CasamentoFormas";
import DetetiveDasPalavras from "./components/DetetiveDasPalavras";
import ComoEExG from "./components/ComoEExG";
import { Sparkles, BookOpen, Crown, Play, Trophy, HelpCircle, Utensils, Magnet, Search as SearchIcon, Zap, FileText } from "lucide-react";
import marioBanner from "./assets/images/mario_game_banner_1780816602934.png";

type ActiveView = 
  | "menu" 
  | "como_e_ex_g"
  | "word_review" 
  | "forma_factory"
  | "casamento_formas"
  | "detetive_palavras"
  | "emoji_detective" 
  | "match_match" 
  | "spelling_bee" 
  | "word_search" 
  | "memory_game" 
  | "tug_of_war_5" 
  | "tug_of_war_10" 
  | "spelling_bee_3" 
  | "goose_chase" 
  | "duo_xiaoxiaole" 
  | "climb_ladder_3" 
  | "climb_ladder_4"
  | "mario_parkour";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("menu");

  const handleBackToMenu = () => {
    setActiveView("menu");
  };

  const selectGame = (view: ActiveView) => {
    setActiveView(view);
  };

  // Define games metadata for rendering cards on menu
  const gameCards = [
    {
      id: "como_e_ex_g",
      title: "G) Como é? 物件形狀問答 📝",
      subTitle: "G. Completar com as palavras (核心重點)",
      description: "Como é a porta? A porta é retangular. 學會回答 6 大物件的形狀！支援一個單詞一個單詞點選組句，或直接選取形狀詞！",
      emoji: "📝",
      color: "bg-amber-100 hover:bg-amber-150 border-amber-500 text-amber-950 font-black",
      badge: "核心練習 🎯"
    },
    {
      id: "forma_factory",
      title: "1) Forma Factory 🏭",
      subTitle: "形狀工廠吃貨王 (街機分類)",
      description: "傳送帶源源不絕掉落日常物品！5 門極速分類，連擊 5 次進入 Festa 派對時間！遇見 retangular 觸發變形超人特效！",
      emoji: "🏭",
      color: "bg-amber-100 hover:bg-amber-150 border-amber-400 text-amber-900",
      badge: "旗艦跑酷 ⭐"
    },
    {
      id: "casamento_formas",
      title: "2) Casamento das Formas 🧲",
      subTitle: "形狀大聯姻 (磁力配對)",
      description: "磁鐵王國名詞與形容詞大配對！同極相斥螢幕微震彈開，異性相吸咔嗒吸附，retangular 雙向萬用雙極吸附！",
      emoji: "🧲",
      color: "bg-purple-100 hover:bg-purple-150 border-purple-400 text-purple-900",
      badge: "磁力消除 💍"
    },
    {
      id: "detetive_palavras",
      title: "3) Detetive das Palavras 🔍",
      subTitle: "名詞密室大逃脫 (解謎冒險)",
      description: "聽取牆上揚聲器語音指令搜查家具！辨析 o quadro (陽) vs a almofada (陰)，集齊三把鑰匙解開 BOSS 終極銘文大門！",
      emoji: "🔍",
      color: "bg-rose-100 hover:bg-rose-150 border-rose-400 text-rose-900",
      badge: "密室逃脫 🗝️"
    },
    {
      id: "word_review",
      title: "4) Banquete & Aulas 📚",
      subTitle: "食物派對 • 課室搜查 • 接尾巴",
      description: "3 大生動互動情境：食物菜單介紹、隨機出題課室大搜查、接尾巴找朋友卡片，內含單詞卡與口訣！",
      emoji: "📚",
      color: "bg-emerald-100 hover:bg-emerald-150 border-emerald-400 text-emerald-900",
      badge: "情境課堂 🍎"
    },
    {
      id: "emoji_detective",
      title: "5) Star Detective 🌟",
      subTitle: "超級星星形狀偵探",
      description: "辨別正確葡語名詞與形狀，收集閃耀星星！下方給予中文提醒引導！",
      emoji: "⭐️",
      color: "bg-pink-100 hover:bg-pink-150 border-pink-300 text-pink-700",
      badge: "闖關挑戰 🔴"
    },
    {
      id: "match_match",
      title: "6) Match Match 🍄",
      subTitle: "神奇蘑菇葡中速配",
      description: "5塊神奇蘑菇葡中字卡配對消除，挑戰大腦形狀記憶反應！",
      emoji: "🍄",
      color: "bg-rose-100 hover:bg-rose-150 border-rose-300 text-rose-750",
      badge: "雙人接力 🟢"
    },
    {
      id: "spelling_bee",
      title: "7) Spelling Bee 🪙",
      subTitle: "黃金金幣拼字挑戰",
      description: "點擊字母收集閃亮金幣！拼出葡語名詞與形狀，帶自動空格提示！",
      emoji: "🪙",
      color: "bg-amber-100 hover:bg-amber-150 border-amber-300 text-amber-700",
      badge: "極速拼字 ⚡"
    },
    {
      id: "mario_parkour",
      title: "8) Spelling Run 🏃‍♂️",
      subTitle: "極速葡語跑酷冒險",
      description: "每拼寫正確一個葡語單詞，瑪利歐向前奔馳！挑戰 6 關拯救碧姬公主！",
      emoji: "🏃‍♂️",
      color: "bg-sky-100 hover:bg-sky-150 border-sky-300 text-sky-700",
      badge: "熱門跑酷 🏁"
    },
    {
      id: "word_search",
      title: "9) Maze Search 🐢",
      subTitle: "庫巴龜殼字母迷宮",
      description: "庫巴將葡語單詞藏在迷宮中！找出全部藏匿英文就可以獲得一條生命！",
      emoji: "🐢",
      color: "bg-cyan-100 hover:bg-cyan-150 border-cyan-300 text-cyan-700",
      badge: "迷宮探索 🧭"
    },
    {
      id: "memory_game",
      title: "10) Fire Flower 🧠",
      subTitle: "火之花瞬時記憶",
      description: "10秒快速記憶！吃下火之花球，預測是哪個葡語形狀單詞悄悄不見了？",
      emoji: "🔥",
      color: "bg-indigo-100 hover:bg-indigo-150 border-indigo-300 text-indigo-700",
      badge: "大腦特訓 ⚡"
    },
    {
      id: "tug_of_war_5",
      title: "11) Yoshi War (5題) 🦖",
      subTitle: "耀西島 5 回合力量對決",
      description: "雙人分隊對戰！騎上耀西，看中文比拼輸入葡語單詞，搶佔拔河優勢！",
      emoji: "🦖",
      color: "bg-purple-100 hover:bg-purple-150 border-purple-300 text-purple-700",
      badge: "雙人 PK 🤼‍♂️"
    },
    {
      id: "tug_of_war_10",
      title: "12) Peach Rescue (10題) 👑",
      subTitle: "拯救碧姬公主 10回合決戰",
      description: "拉長拉拉線大比拼！答題快準狠，向你的一側拉近並拯救碧姬公主！",
      emoji: "👑",
      color: "bg-violet-100 hover:bg-violet-150 border-violet-300 text-violet-750",
      badge: "雙人拔河 ⚔️"
    },
    {
      id: "spelling_bee_3",
      title: "13) Spelling Bee 3 ⚡",
      subTitle: "閃電黃金拼字拉力賽",
      description: "三回合競速極致對仗！誰答對得最多最快，就可以獲得超級獎金！",
      emoji: "⚡",
      color: "bg-orange-100 hover:bg-orange-150 border-orange-300 text-orange-700",
      badge: "急速黃金 🪙"
    },
    {
      id: "goose_chase",
      title: "14) Cape Feathers 🧺",
      subTitle: "披風羽毛天降戰",
      description: "經典飛天白鵝對仗！拖曳飛天鵝到己方道具籃，擊敗對手的白鵝！",
      emoji: "🧺",
      color: "bg-emerald-100 hover:bg-emerald-150 border-emerald-300 text-emerald-750",
      badge: "雙人飛天 🦢"
    },
    {
      id: "duo_xiaoxiaole",
      title: "15) Brick Eliminator 🧱",
      subTitle: "同屏雙人消除磚塊大戰",
      description: "專屬各半屏幕雙人消消樂！清除擋在你面前的葡中相符磚塊，爭奪消除大王！",
      emoji: "🧱",
      color: "bg-teal-100 hover:bg-teal-150 border-teal-300 text-teal-750",
      badge: "雙玩家消消樂 🤝"
    },
    {
      id: "climb_ladder_3",
      title: "16) Climb Ladder (3人) 🪜",
      subTitle: "三人城堡爬行大對抗",
      description: "碧姬公主城堡爬爬挑戰！四選一多級選項，看誰的手指動得比庫巴還快！",
      emoji: "🧗",
      color: "bg-blue-100 hover:bg-blue-150 border-blue-300 text-blue-750",
      badge: "三人分組 🏰"
    },
    {
      id: "climb_ladder_4",
      title: "17) Climb Ladder (4人) 🪜",
      subTitle: "四人超級庫巴城堡爭霸",
      description: "終極 4 名玩家多人大亂鬥！每前進一步都將點亮城堡。看看誰能最終救下公主！",
      emoji: "🏰",
      color: "bg-red-100 hover:bg-red-150 border-red-300 text-red-750",
      badge: "四人大亂鬥 🏆"
    }
  ];

  return (
    <div className="min-h-screen mario-sky-bg text-[#2D2D2D] p-4 md:p-6 pb-12 flex flex-col items-center">
      <div className="w-full max-w-7xl animate-fade-in">
        <Header onBackToMenu={handleBackToMenu} currentGame={activeView === "menu" ? null : activeView} />

        <main className="w-full">
          {activeView === "menu" && (
            <div className="animate-fade-in col-span-1">
              
              {/* Retro Mario Graphic Banner Scene */}
              <div className="w-full bg-[#FFF8E7] border-4 border-black rounded-3xl p-4 md:p-5 mb-8 shadow-[8px_8px_0px_#000000] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full md:w-3/5 border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000000] relative bg-[#5C94FC] h-48 md:h-64 flex items-center justify-center">
                  <img 
                    src={marioBanner} 
                    alt="Mario Adventure" 
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass Reflex overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>
                <div className="w-full md:w-2/5 text-center md:text-left flex flex-col justify-center">
                  <div className="inline-flex items-center gap-1.5 bg-[#E52521] border-2 border-black text-white px-3 py-1 rounded-xl text-xs font-black shadow-[2px_2px_0px_#000] mb-3 self-center md:self-start">
                    <span className="animate-bounce">🔴</span>
                    <span>AS FORMAS EM PORTUGUÊS!</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-stone-900 tracking-tight leading-normal mb-2 font-pixel text-[#E52521]">
                    PROFRESORA IONG!
                  </h3>
                  <p className="text-stone-700 font-bold text-xs leading-relaxed mb-4">
                    掌握葡語形容詞與名詞的「陰陽性配合」：<br />
                    • <span className="text-blue-700 font-black">redondo / redonda</span> (圓形)<br />
                    • <span className="text-emerald-700 font-black">quadrado / quadrada</span> (正方形)<br />
                    • <span className="text-amber-700 font-black">retangular 變形超人 ⭐</span> (長方形 男生女生衣服都不變！)
                  </p>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <span className="text-3xl animate-bounce">☀️</span>
                    <span className="text-3xl animate-pulse">🍕</span>
                    <span className="text-3xl animate-spin">🎲</span>
                    <span className="text-3xl animate-bounce" style={{ animationDelay: "150ms" }}>📖</span>
                  </div>
                </div>
              </div>

              {/* Step 1 Prominent Notice Banner (Word list review requested!) */}
              <div className="bg-[#FFF8E7] border-4 border-black rounded-2xl p-6 md:p-8 text-center shadow-[6px_6px_0px_#000000] mb-8 relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[#ff9900] text-6xl opacity-15 select-none pointer-events-none font-black font-pixel">?</div>
                <div className="absolute bottom-2 right-2 text-[#ff9910] text-6xl opacity-15 select-none pointer-events-none font-black font-pixel">*</div>
                
                <p className="text-[#E52521] font-black text-sm tracking-wider uppercase mb-1">
                  🍄 核心重點 • 回答物件形狀與陰陽性配合 📚
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-2">
                  🌟 Profresora Iong 葡語形狀與陰陽性配合 🌟
                </h2>

                {/* Big prominent shape vocabulary cards requested by user */}
                <div className="my-5 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 border-4 border-blue-600 p-5 rounded-2xl shadow-[5px_5px_0px_#1e3a8a] flex flex-col justify-center items-center">
                    <span className="text-4xl mb-1">🔵</span>
                    <div className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">
                      redondo / redonda
                    </div>
                    <div className="text-lg md:text-xl font-black text-blue-700 mt-1">
                      — 圓形的
                    </div>
                    <div className="text-xs font-bold text-blue-950 mt-1">
                      (陽性 -o / 陰性 -a)
                    </div>
                  </div>

                  <div className="bg-emerald-50 border-4 border-emerald-600 p-5 rounded-2xl shadow-[5px_5px_0px_#064e3b] flex flex-col justify-center items-center">
                    <span className="text-4xl mb-1">🟩</span>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 tracking-tight">
                      quadrado / quadrada
                    </div>
                    <div className="text-lg md:text-xl font-black text-emerald-700 mt-1">
                      — 正方形的
                    </div>
                    <div className="text-xs font-bold text-emerald-950 mt-1">
                      (陽性 -o / 陰性 -a)
                    </div>
                  </div>

                  <div className="bg-amber-50 border-4 border-amber-600 p-5 rounded-2xl shadow-[5px_5px_0px_#78350f] flex flex-col justify-center items-center">
                    <span className="text-4xl mb-1">⭐</span>
                    <div className="text-xl md:text-2xl font-black text-amber-950 tracking-tight">
                      retangular
                    </div>
                    <div className="text-lg md:text-xl font-black text-amber-700 mt-1">
                      — 長方形的
                    </div>
                    <div className="text-xs font-bold text-amber-900 mt-1">
                      (變形超人 男生女生都一樣！)
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => selectGame("como_e_ex_g")}
                    className="mario-btn mario-btn-yellow text-stone-950 px-7 py-3.5 font-black text-base md:text-lg flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
                  >
                    <span>📝 G. 回答物件形狀練習 (Completar com as palavras) 🚀</span>
                  </button>

                  <button
                    onClick={() => selectGame("word_review")}
                    className="mario-btn mario-btn-blue text-white px-5 py-3.5 font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>形狀單詞庫 & 3大情境 📣</span>
                  </button>
                </div>
              </div>

              {/* Step 2 Game Selection Dashboard */}
              <div className="mb-6 text-center">
                <span className="text-xs font-black text-white bg-[#E52521] border-2 border-black px-4 py-1.5 rounded-xl max-w-sm mx-auto mb-2 inline-block shadow-[2px_2px_0px_#000000] uppercase">
                  🎮 CHOOSE YOUR GAME • 選擇挑戰模式 🎮
                </span>
                <h3 
                  style={{ textShadow: "2px 2px 0px #000000" }}
                  className="text-2xl md:text-3xl font-black text-[#FED42C] flex items-center justify-center gap-1.5"
                >
                  <span>Profresora Iong 葡語形狀闖關機 👾</span>
                </h3>
                <p className="text-white drop-shadow font-bold text-xs mt-1">
                  支援街機跑酷、磁力配對、密室逃脫與多人在線對決！積累金幣，掌握陰陽性！🍄
                </p>
              </div>

              {/* Game Cards Grid Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gameCards.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => selectGame(game.id as ActiveView)}
                    className="group cursor-pointer bg-white text-stone-800 rounded-xl p-5 border-4 border-black hover:bg-[#FED42C] hover:text-black transition-all duration-150 shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#000000] hover:-translate-y-1 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] relative flex flex-col justify-between overflow-hidden min-h-[220px] select-none"
                  >
                    
                    {/* Badge top corner */}
                    <div className="absolute top-2.5 right-2.5 bg-[#FFF8E7] border-2 border-black text-stone-955 px-2 py-0.5 rounded-lg text-[9px] font-black shadow-sm group-hover:bg-white">
                      {game.badge}
                    </div>

                    <div>
                      {/* Logo and Headings */}
                      <div className="text-4xl mb-3 block group-hover:scale-110 transition-transform duration-200 pointer-events-none">
                        {game.emoji}
                      </div>

                      <h4 className="text-base font-black leading-snug tracking-tight">
                        {game.title}
                      </h4>
                      <p className="text-xs font-bold text-[#E52521] opacity-90 mt-0.5 group-hover:text-stone-900">
                        {game.subTitle}
                      </p>
                      
                      <p className="text-[11px] font-bold text-stone-600 leading-relaxed mt-2.5 line-clamp-3 group-hover:text-stone-900 font-sans">
                        {game.description}
                      </p>
                    </div>

                    {/* Footer interactive hints */}
                    <div className="mt-4 flex items-center justify-between text-[10px] font-black">
                      <span className="flex items-center gap-1 text-stone-500 group-hover:text-stone-800">
                        <span className="text-amber-500 animate-spin inline-block">⭐</span>
                        <span>Profresora Iong Edition</span>
                      </span>
                      <span className="mario-btn mario-btn-red text-[10px] px-2.5 py-1 text-white group-hover:bg-white group-hover:text-[#E52521] select-none">
                        點擊挑戰 🚀
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render individual games router viewpoints */}
          {activeView === "como_e_ex_g" && (
            <ComoEExG onBack={handleBackToMenu} />
          )}

          {activeView === "forma_factory" && (
            <FormaFactory onBack={handleBackToMenu} />
          )}

          {activeView === "casamento_formas" && (
            <CasamentoFormas onBack={handleBackToMenu} />
          )}

          {activeView === "detetive_palavras" && (
            <DetetiveDasPalavras onBack={handleBackToMenu} />
          )}

          {activeView === "word_review" && (
            <WordListReview 
              onBack={handleBackToMenu} 
              onSelectChapter={(ch) => console.log(ch)} 
            />
          )}

          {activeView === "emoji_detective" && (
            <EmojiDetective onBack={handleBackToMenu} />
          )}

          {activeView === "match_match" && (
            <ChMatchMatch onBack={handleBackToMenu} />
          )}

          {activeView === "spelling_bee" && (
            <SpellingBee onBack={handleBackToMenu} />
          )}

          {activeView === "mario_parkour" && (
            <MarioRunParkour onBack={handleBackToMenu} />
          )}

          {activeView === "word_search" && (
            <WordSearch onBack={handleBackToMenu} />
          )}

          {activeView === "memory_game" && (
            <MemoryGame onBack={handleBackToMenu} />
          )}

          {activeView === "tug_of_war_5" && (
            <TugOfWar onBack={handleBackToMenu} roundsCount={5} />
          )}

          {activeView === "tug_of_war_10" && (
            <TugOfWar onBack={handleBackToMenu} roundsCount={10} />
          )}

          {activeView === "spelling_bee_3" && (
            <SpellingBee onBack={handleBackToMenu} isCompetitionMode={true} />
          )}

          {activeView === "goose_chase" && (
            <GooseChase onBack={handleBackToMenu} />
          )}

          {activeView === "duo_xiaoxiaole" && (
            <DuoXiaoXiaoLe onBack={handleBackToMenu} />
          )}

          {activeView === "climb_ladder_3" && (
            <ClimbLadder onBack={handleBackToMenu} playersCount={3} />
          )}

          {activeView === "climb_ladder_4" && (
            <ClimbLadder onBack={handleBackToMenu} playersCount={4} />
          )}
        </main>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(244, 63, 94, 0.05);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(244, 63, 94, 0.2);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 63, 94, 0.4);
        }

        @keyframes wobble {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
        }
        .animate-wobble {
          animation: wobble 4s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.25s ease-in-out double;
        }

        .shake-animation {
          animation: shake 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
