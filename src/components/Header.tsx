import React, { useState } from "react";
import { Volume2, VolumeX, Sparkles, Heart } from "lucide-react";
import { toggleMute, isMuted } from "../utils/sound";

interface HeaderProps {
  onBackToMenu: () => void;
  currentGame: string | null;
}

export default function Header({ onBackToMenu, currentGame }: HeaderProps) {
  const [muted, setMuted] = useState(isMuted());

  const handleToggleMute = () => {
    const newMuteState = toggleMute();
    setMuted(newMuteState);
  };

  return (
    <header className="w-full bg-[#FED42C] border-4 border-black py-4 px-6 flex flex-col md:flex-row items-center justify-between shadow-[6px_6px_0px_#000000] rounded-2xl mb-6 gap-4 relative overflow-hidden">
      <div 
        onClick={onBackToMenu}
        className="flex items-center gap-3 cursor-pointer hover:scale-102 transition-transform duration-200 select-none"
      >
        <div className="bg-white p-2.5 rounded-xl border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_#000000]">
          <span className="text-2xl animate-bounce">🍄</span>
        </div>
        <div>
          <h1 
            style={{ textShadow: "2px 2px 0px #000000" }}
            className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2"
          >
            <span>PROFRESORA IONG</span>
            <span className="text-red-600 font-bold" style={{ textShadow: "1.5px 1.5px 0px #FFFFFF" }}>PORTUGUÊS</span>
          </h1>
          <p className="text-xs text-black/85 font-black drop-shadow-sm flex items-center gap-1">
            <span>⭐ As Formas em Português • 陰陽性配合 👑</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        {currentGame && (
          <button
            onClick={onBackToMenu}
            className="mario-btn mario-btn-red px-5 py-2.5 text-white text-xs md:text-sm cursor-pointer"
          >
            <span>🏠 返回大廳 (Menu Principal)</span>
          </button>
        )}

        <button
          onClick={handleToggleMute}
          className={`p-2.5 rounded-xl border-3 border-black shadow-[3px_3px_0px_#000000] transition-all duration-205 flex items-center justify-center cursor-pointer ${
            muted 
              ? "bg-[#FFF8E7] text-gray-500" 
              : "bg-white text-[#E52521] hover:scale-110"
          }`}
          title={muted ? "解除靜音" : "靜音"}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
        </button>

        <div className="bg-white border-3 border-black px-4 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black text-stone-900 shadow-[3px_3px_0px_#000000]">
          <span className="text-amber-500 text-sm animate-spin inline-block">⭐</span>
          <span>變形超人 retangular • 陰陽同形！</span>
        </div>
      </div>
    </header>
  );
}
