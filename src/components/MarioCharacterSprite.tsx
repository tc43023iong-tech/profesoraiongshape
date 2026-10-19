import React, { useState, useEffect } from "react";

export type MarioCharacterType = "mario" | "luigi" | "peach" | "toad";
export type MarioAnimationType = "idle" | "walk" | "climb" | "win" | "pulling";

interface MarioCharacterSpriteProps {
  character: MarioCharacterType;
  animation: MarioAnimationType;
  className?: string;
  size?: number; // Size in pixels
}

const COLOR_MAP = {
  ".": "transparent",
  "r": "#E52521", // Mario red
  "g": "#00A24A", // Luigi green
  "b": "#0043A4", // Overalls blue
  "s": "#FCD8A5", // Skin tone peach
  "k": "#4B2500", // Hair/shoe brown/black
  "y": "#FED42C", // Gold/blonde
  "p": "#FF69B4", // Peach dress pink
  "w": "#FFFFFF", // White
  "o": "#FF9900", // Orange
  "u": "#63B3ED", // Light blue
};

const MARIO_FRAMES = {
  idle: [
    "..rrrrr.....",
    ".rrrrrrrrr..",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..rrbbrr....",
    ".rrrbbrrbr..",
    "rrrrbbbbrrr.",
    "ssrrbyybrrss",
    "ssbbbbbbbbss",
    ".bbbbbbbbbb.",
    "..bbb..bbb..",
    ".kkk....kkk.",
    "kkkk....kkkk"
  ],
  walk1: [
    "..rrrrr.....",
    ".rrrrrrrrr..",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..rrbbrr....",
    ".rrrbbrrbr..",
    "rrrrbbbbrrr.",
    "ssrrbyybrrss",
    "ssbbbbbbbbss",
    ".bbbbbbbbbb.",
    "..bbbbb.....",
    "...kkk......",
    "..kkkkkk...."
  ],
  walk2: [
    "..rrrrr.....",
    ".rrrrrrrrr..",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..rrbbrr....",
    ".rrrbbrrbr..",
    "rrrrbbbbrrr.",
    "ssrrbyybrrss",
    "ssbbbbbbbbss",
    ".bbbbbbbbbb.",
    ".....bbbbb..",
    "......kkk...",
    "....kkkkkk.."
  ],
  win: [
    "s.rrrrr....s",
    "ssrrrrrrrrss",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..rrbbrr....",
    ".rrrbbrrbr..",
    "rrrrbbbbrrr.",
    "..rrbyybrr..",
    "..bbbbbbbb..",
    ".bbbbbbbbbb.",
    "..bbb..bbb..",
    ".kkk....kkk.",
    "kkkk....kkkk"
  ],
  pulling: [
    "....rrrrr...",
    "...rrrrrrrrr",
    "...kkksskss.",
    "..kskssskss.",
    "..kskkssskss",
    "..kksssskkkk",
    "......sssss.",
    "....rrbbrr..",
    "...rrrbbrrbr",
    "..rrrrbbbbrr",
    "ss.ssrrbyybr",
    "sss.ssbbbbbb",
    ".ss..bbbbbbb",
    "....bbb...bb",
    "...kkk....kk",
    "..kkkk...kkk"
  ]
};

const LUIGI_FRAMES = {
  idle: [
    "..ggggg.....",
    ".ggggggggg..",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..ggbbgg....",
    ".gggbbggbb..",
    "ggggbbbbbb..",
    "ssggbyybggss",
    "ssbbbbbbbbss",
    ".bbbbbbbbbb.",
    "..bbb..bbb..",
    ".kkk....kkk.",
    "kkkk....kkkk"
  ],
  walk1: [
    "..ggggg.....",
    ".ggggggggg..",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..ggbbgg....",
    ".gggbbggbb..",
    "ggggbbbbbb..",
    "ssggbyybggss",
    "ssbbbbbbbbss",
    ".bbbbbbbbbb.",
    "..bbbbb.....",
    "...kkk......",
    "..kkkkkk...."
  ],
  walk2: [
    "..ggggg.....",
    ".ggggggggg..",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..ggbbgg....",
    ".gggbbggbb..",
    "ggggbbbbbb..",
    "ssggbyybggss",
    "ssbbbbbbbbss",
    ".bbbbbbbbbb.",
    ".....bbbbb..",
    "......kkk...",
    "....kkkkkk.."
  ],
  win: [
    "s.ggggg....s",
    "ssggggggggss",
    ".kkksskss...",
    "kskssskss...",
    "kskksssksss.",
    "kksssskkkk..",
    "....sssss...",
    "..ggbbgg....",
    ".gggbbggbb..",
    "ggggbbbbbb..",
    "..ggbyybgg..",
    "..bbbbbbbb..",
    ".bbbbbbbbbb.",
    "..bbb..bbb..",
    ".kkk....kkk.",
    "kkkk....kkkk"
  ],
  pulling: [
    "....ggggg...",
    "...ggggggggg",
    "...kkksskss.",
    "..kskssskss.",
    "..kskkssskss",
    "..kksssskkkk",
    "......sssss.",
    "....ggbbgg..",
    "...gggbbggbb",
    "..ggggbbbbgg",
    "ss.ssggbyybg",
    "sss.ssbbbbbb",
    ".ss..bbbbbbb",
    "....bbb...bb",
    "...kkk....kk",
    "..kkkk...kkk"
  ]
};

const PEACH_FRAMES = {
  idle: [
    "....ooyoo...",
    "...oyuyuyo..",
    "....yyyyy...",
    "...ysssys...",
    "..ysssssys..",
    "..ysuskssys.",
    "...yssssys..",
    "....yyyyy...",
    "...ppppppp..",
    "..ppppppppp.",
    ".ppspppppspp",
    "ppspppppppss",
    ".pppppppppp.",
    "..pppppppp..",
    "...kk..kk...",
    "..kkk..kkk.."
  ],
  walk1: [
    "....ooyoo...",
    "...oyuyuyo..",
    "....yyyyy...",
    "...ysssys...",
    "..ysssssys..",
    "..ysuskssys.",
    "...yssssys..",
    "....yyyyy...",
    "...ppppppp..",
    "..ppppppppp.",
    ".ppspppppspp",
    "ppspppppppss",
    ".pppppppppp.",
    "..pppppp....",
    "...kkk......",
    "..kkkk......"
  ],
  walk2: [
    "....ooyoo...",
    "...oyuyuyo..",
    "....yyyyy...",
    "...ysssys...",
    "..ysssssys..",
    "..ysuskssys.",
    "...yssssys..",
    "....yyyyy...",
    "...ppppppp..",
    "..ppppppppp.",
    ".ppspppppspp",
    "ppspppppppss",
    ".pppppppppp.",
    "....pppppp..",
    "......kkk...",
    "......kkkk.."
  ],
  win: [
    "s...ooyoo..s",
    "ss.oyuyuyo.ss",
    "....yyyyy...",
    "...ysssys...",
    "..ysssssys..",
    "..ysuskssys.",
    "...yssssys..",
    "....yyyyy...",
    "...ppppppp..",
    "..ppppppppp.",
    "..ppppppppp.",
    "..ppppppppp.",
    ".pppppppppp.",
    "..pppppppp..",
    "...kk..kk...",
    "..kkk..kkk.."
  ],
  pulling: [
    ".....ooyoo..",
    "....oyuyuyo.",
    ".....yyyyy..",
    "....ysssys..",
    "...ysssssys.",
    "...ysuskssys",
    "....yssssys.",
    ".....yyyyy..",
    "....ppppppp.",
    "...ppppppppp",
    "ss.pspppppsp",
    "ss.ppppppppp",
    ".s..pppppppp",
    "....pppp.ppp",
    "...kk.....kk",
    "..kkk....kkk"
  ]
};

const TOAD_FRAMES = {
  idle: [
    "....wwwww...",
    "..wwrrrrrww.",
    ".wrrrrrrrrrw",
    "wrrrrwwwwwrr",
    "wrrwwwwwrrwr",
    ".wwwwwwwww...",
    "...ssssss...",
    "..ssssssss..",
    "..ssskksss..",
    "...ssssss...",
    "..wwbbbbww..",
    ".wwbbbbbbww.",
    ".wwwwwwwwww.",
    "..wwwwwwww..",
    "...kk..kk...",
    "..kkk..kkk.."
  ],
  walk1: [
    "....wwwww...",
    "..wwrrrrrww.",
    ".wrrrrrrrrrw",
    "wrrrrwwwwwrr",
    "wrrwwwwwrrwr",
    ".wwwwwwwww...",
    "...ssssss...",
    "..ssssssss..",
    "..ssskksss..",
    "...ssssss...",
    "..wwbbbbww..",
    ".wwbbbbbbww.",
    ".wwwwwwwwww.",
    "..wwwwww....",
    "...kkk......",
    "..kkkk......"
  ],
  walk2: [
    "....wwwww...",
    "..wwrrrrrww.",
    ".wrrrrrrrrrw",
    "wrrrrwwwwwrr",
    "wrrwwwwwrrwr",
    ".wwwwwwwww...",
    "...ssssss...",
    "..ssssssss..",
    "..ssskksss..",
    "...ssssss...",
    "..wwbbbbww..",
    ".wwbbbbbbww.",
    ".wwwwwwwwww.",
    "....wwwwww..",
    "......kkk...",
    "......kkkk.."
  ],
  win: [
    "s...wwwww..s",
    "sswwrrrrrwwss",
    ".wrrrrrrrrrw",
    "wrrrrwwwwwrr",
    "wrrwwwwwrrwr",
    ".wwwwwwwww...",
    "...ssssss...",
    "..ssssssss..",
    "..ssskksss..",
    "...ssssss...",
    "..bbbbbbbb..",
    "..bbbbbbbb..",
    ".wwwwwwwwww.",
    "..wwwwwwww..",
    "...kk..kk...",
    "..kkk..kkk.."
  ],
  pulling: [
    ".....wwwww..",
    "...wwrrrrrww",
    "..wrrrrrrrrr",
    ".wrrrrwwwwwr",
    ".wrrwwwwwrrw",
    "..wwwwwwwww.",
    "....ssssss..",
    "...ssssssss.",
    "...ssskksss.",
    "....ssssss..",
    "...wwbbbbww.",
    "ss.wbbbbbbww",
    "ss.wwwwwwwww",
    "..wwwww..www",
    "..kk......kk",
    ".kkk.....kkk"
  ]
};

export default function MarioCharacterSprite({
  character,
  animation,
  className = "",
  size = 48,
}: MarioCharacterSpriteProps) {
  const [tick, setTick] = useState<number>(0);

  // Run the walk cycle clock
  useEffect(() => {
    if (animation === "idle") {
      setTick(0);
      return;
    }

    const speed = animation === "win" ? 250 : 180;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, speed);

    return () => clearInterval(interval);
  }, [animation]);

  // Retrieve current active character library
  let framesLib;
  switch (character) {
    case "luigi":
      framesLib = LUIGI_FRAMES;
      break;
    case "peach":
      framesLib = PEACH_FRAMES;
      break;
    case "toad":
      framesLib = TOAD_FRAMES;
      break;
    case "mario":
    default:
      framesLib = MARIO_FRAMES;
      break;
  }

  // Resolve frame based on animation and current tick
  let currentFrameStrArr: string[];
  switch (animation) {
    case "walk":
    case "climb":
      currentFrameStrArr = tick % 2 === 0 ? framesLib.walk1 : framesLib.walk2;
      break;
    case "win":
      currentFrameStrArr = tick % 2 === 0 ? framesLib.win : framesLib.idle;
      break;
    case "pulling":
      currentFrameStrArr = tick % 2 === 0 ? framesLib.pulling : framesLib.idle;
      break;
    case "idle":
    default:
      currentFrameStrArr = framesLib.idle;
      break;
  }

  // Ensure row has proper layout padding
  const height = 16;
  const width = 12;

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * (height / width)}px`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ imageRendering: "pixelated" }}
      >
        {currentFrameStrArr.map((rowStr, y) => {
          // Normalize row length to match structural width (12 pixels)
          const pixelChars = rowStr.padEnd(width, ".").split("");
          return pixelChars.map((char, x) => {
            const color = COLOR_MAP[char as keyof typeof COLOR_MAP] || "transparent";
            if (color === "transparent") return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
              />
            );
          });
        })}
      </svg>
    </div>
  );
}
