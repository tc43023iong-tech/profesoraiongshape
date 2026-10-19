export interface Word {
  id: string;
  english: string; // Used by existing mini-games (e.g. "o sol", "a pizza")
  portuguese: string;
  chinese: string;
  emoji: string;
  chapter: string;
  gender: "m" | "f" | "both";
  article: "o" | "a" | "";
  shape: "circle" | "square" | "rectangle";
  targetAdj: "redondo" | "redonda" | "quadrado" | "quadrada" | "retangular";
  exampleSentence: string;
  sentenceChinese: string;
  isFood?: boolean;
  hint?: string;
}

export const CHAPTERS = [
  "All",
  "1. 圓形組 (Redondo/a)",
  "2. 正方形組 (Quadrado/a)",
  "3. 長方形組 (Retangular)",
  "4. 美味食物王國 (Comida)"
];

export function filterWordsByChapter(chapter: string): Word[] {
  if (!chapter || chapter === "All" || chapter.startsWith("Part")) return WORD_LIST;
  if (chapter.includes("食物") || chapter.includes("Comida")) {
    return WORD_LIST.filter(w => w.isFood);
  }
  return WORD_LIST.filter(w => w.chapter === chapter);
}

export const SHAPE_RULES = {
  intro: "形容詞與名詞的「陰陽性配合」：結尾為 -o（陽性）與 -a（陰性）；結尾為 -ar 的 retangular 陰陽性同形！",
  supermanTip: "教學小口訣：retangular 像「變形超人」，不管是男生 (o) 還是女生 (a)，衣服都不變！",
  motto: "O 結尾配 -o (陽性)，A 結尾配 -a (陰性)，遇見 retangular 男生女生都一樣！"
};

export const WORD_LIST: Word[] = [
  // 1. 圓形組 (redondo / redonda) - 陽性
  {
    id: "circ_m_1",
    english: "o sol",
    portuguese: "o sol",
    chinese: "太陽 (陽性)",
    emoji: "☀️",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "m",
    article: "o",
    shape: "circle",
    targetAdj: "redondo",
    exampleSentence: "O sol é redondo.",
    sentenceChinese: "太陽是圓形的。",
    hint: "陽性名詞 (o sol) 搭配陽性形容詞 redondo (-o)！"
  },
  {
    id: "circ_m_2",
    english: "o relógio",
    portuguese: "o relógio",
    chinese: "手錶/掛鐘 (陽性)",
    emoji: "⏰",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "m",
    article: "o",
    shape: "circle",
    targetAdj: "redondo",
    exampleSentence: "O relógio é redondo.",
    sentenceChinese: "時鐘是圓形的。",
    hint: "陽性名詞 (o relógio) 搭配陽性形容詞 redondo (-o)！"
  },
  {
    id: "circ_m_3",
    english: "o chupa-chupa",
    portuguese: "o chupa-chupa",
    chinese: "棒棒糖 (陽性)",
    emoji: "🍭",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "m",
    article: "o",
    shape: "circle",
    targetAdj: "redondo",
    exampleSentence: "O chupa-chupa é redondo.",
    sentenceChinese: "棒棒糖是圓形的。",
    isFood: true,
    hint: "陽性食物 (o chupa-chupa) 搭配陽性形容詞 redondo (-o)！"
  },
  {
    id: "circ_m_4",
    english: "o pirulito",
    portuguese: "o pirulito",
    chinese: "棒棒糖 (陽性)",
    emoji: "🍭",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "m",
    article: "o",
    shape: "circle",
    targetAdj: "redondo",
    exampleSentence: "O pirulito é redondo.",
    sentenceChinese: "棒棒糖是圓形的。",
    isFood: true,
    hint: "陽性名詞 (o pirulito) 搭配陽性形容詞 redondo (-o)！"
  },

  // 1. 圓形組 - 陰性
  {
    id: "circ_f_1",
    english: "a bola",
    portuguese: "a bola",
    chinese: "球 (陰性)",
    emoji: "⚽",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "f",
    article: "a",
    shape: "circle",
    targetAdj: "redonda",
    exampleSentence: "A bola é redonda.",
    sentenceChinese: "球是圓形的。",
    hint: "陰性名詞 (a bola) 搭配陰性形容詞 redonda (-a)！"
  },
  {
    id: "circ_f_2",
    english: "a pizza",
    portuguese: "a pizza",
    chinese: "披薩 (陰性)",
    emoji: "🍕",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "f",
    article: "a",
    shape: "circle",
    targetAdj: "redonda",
    exampleSentence: "A pizza é redonda.",
    sentenceChinese: "披薩是圓形的。",
    isFood: true,
    hint: "陰性食物 (a pizza) 搭配陰性形容詞 redonda (-a)！"
  },
  {
    id: "circ_f_3",
    english: "a moeda",
    portuguese: "a moeda",
    chinese: "硬幣 (陰性)",
    emoji: "🪙",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "f",
    article: "a",
    shape: "circle",
    targetAdj: "redonda",
    exampleSentence: "A moeda é redonda.",
    sentenceChinese: "硬幣是圓形的。",
    hint: "陰性名詞 (a moeda) 搭配陰性形容詞 redonda (-a)！"
  },

  // 2. 正方形組 (quadrado / quadrada) - 陽性
  {
    id: "sq_m_1",
    english: "o cubo mágico",
    portuguese: "o cubo mágico",
    chinese: "魔方 (陽性)",
    emoji: "🎲",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "m",
    article: "o",
    shape: "square",
    targetAdj: "quadrado",
    exampleSentence: "O cubo mágico é quadrado.",
    sentenceChinese: "魔方是正方形的。",
    hint: "陽性名詞 (o cubo mágico) 搭配陽性形容詞 quadrado (-o)！"
  },
  {
    id: "sq_m_2",
    english: "o quadro",
    portuguese: "o quadro",
    chinese: "畫框/黑板 (陽性)",
    emoji: "🖼️",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "m",
    article: "o",
    shape: "square",
    targetAdj: "quadrado",
    exampleSentence: "O quadro é quadrado.",
    sentenceChinese: "畫框是正方形的。",
    hint: "陽性名詞 (o quadro) 搭配陽性形容詞 quadrado (-o)！"
  },
  {
    id: "sq_m_3",
    english: "o lenço",
    portuguese: "o lenço",
    chinese: "手帕/方巾 (陽性)",
    emoji: "🧣",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "m",
    article: "o",
    shape: "square",
    targetAdj: "quadrado",
    exampleSentence: "O lenço é quadrado.",
    sentenceChinese: "手帕是正方形的。",
    hint: "陽性名詞 (o lenço) 搭配陽性形容詞 quadrado (-o)！"
  },
  {
    id: "sq_m_4",
    english: "o cubo de açúcar",
    portuguese: "o cubo de açúcar",
    chinese: "方糖 (陽性)",
    emoji: "🧊",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "m",
    article: "o",
    shape: "square",
    targetAdj: "quadrado",
    exampleSentence: "O cubo de açúcar é quadrado.",
    sentenceChinese: "方糖是正方形的。",
    isFood: true,
    hint: "陽性名詞 (o cubo de açúcar) 搭配陽性形容詞 quadrado (-o)！"
  },

  // 2. 正方形組 - 陰性
  {
    id: "sq_f_1",
    english: "a caixa",
    portuguese: "a caixa",
    chinese: "盒子 (陰性)",
    emoji: "📦",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "f",
    article: "a",
    shape: "square",
    targetAdj: "quadrada",
    exampleSentence: "A caixa é quadrada.",
    sentenceChinese: "盒子是正方形的。",
    hint: "陰性名詞 (a caixa) 搭配陰性形容詞 quadrada (-a)！"
  },
  {
    id: "sq_f_2",
    english: "a almofada",
    portuguese: "a almofada",
    chinese: "抱枕/靠墊 (陰性)",
    emoji: "🛋️",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "f",
    article: "a",
    shape: "square",
    targetAdj: "quadrada",
    exampleSentence: "A almofada é quadrada.",
    sentenceChinese: "抱枕是正方形的。",
    hint: "陰性名詞 (a almofada) 搭配陰性形容詞 quadrada (-a)！"
  },
  {
    id: "sq_f_3",
    english: "a bolacha",
    portuguese: "a bolacha",
    chinese: "正方形餅乾 (陰性)",
    emoji: "🧇",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "f",
    article: "a",
    shape: "square",
    targetAdj: "quadrada",
    exampleSentence: "A bolacha é quadrada.",
    sentenceChinese: "餅乾是正方形的。",
    isFood: true,
    hint: "陰性食物 (a bolacha) 搭配陰性形容詞 quadrada (-a)！"
  },

  // 3. 長方形組 (retangular —— 男生女生都一樣！) - 陽性
  {
    id: "rec_m_1",
    english: "o telemóvel",
    portuguese: "o telemóvel",
    chinese: "手機 (陽性)",
    emoji: "📱",
    chapter: "3. 長方形組 (Retangular)",
    gender: "m",
    article: "o",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "O telemóvel é retangular.",
    sentenceChinese: "手機是長方形的。",
    hint: "變形超人！陽性 o telemóvel 搭配 retangular 不變形！"
  },
  {
    id: "rec_m_2",
    english: "o celular",
    portuguese: "o celular",
    chinese: "手機 (陽性)",
    emoji: "📱",
    chapter: "3. 長方形組 (Retangular)",
    gender: "m",
    article: "o",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "O celular é retangular.",
    sentenceChinese: "手機是長方形的。",
    hint: "變形超人！陽性 o celular 搭配 retangular 不變形！"
  },
  {
    id: "rec_m_3",
    english: "o livro",
    portuguese: "o livro",
    chinese: "書本 (陽性)",
    emoji: "📖",
    chapter: "3. 長方形組 (Retangular)",
    gender: "m",
    article: "o",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "O livro é retangular.",
    sentenceChinese: "書本是長方形的。",
    hint: "變形超人！陽性 o livro 搭配 retangular 不變形！"
  },
  {
    id: "rec_m_4",
    english: "o chocolate",
    portuguese: "o chocolate",
    chinese: "長條巧克力磚 (陽性)",
    emoji: "🍫",
    chapter: "3. 長方形組 (Retangular)",
    gender: "m",
    article: "o",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "O chocolate é retangular.",
    sentenceChinese: "巧克力磚是長方形的。",
    isFood: true,
    hint: "變形超人！陽性食物 o chocolate 搭配 retangular 不變形！"
  },

  // 3. 長方形組 - 陰性
  {
    id: "rec_f_1",
    english: "a régua",
    portuguese: "a régua",
    chinese: "尺 (陰性)",
    emoji: "📏",
    chapter: "3. 長方形組 (Retangular)",
    gender: "f",
    article: "a",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "A régua é retangular.",
    sentenceChinese: "尺是長方形的。",
    hint: "變形超人！陰性 a régua 搭配 retangular 同樣不變形！"
  },
  {
    id: "rec_f_2",
    english: "a cama",
    portuguese: "a cama",
    chinese: "床 (陰性)",
    emoji: "🛏️",
    chapter: "3. 長方形組 (Retangular)",
    gender: "f",
    article: "a",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "A cama é retangular.",
    sentenceChinese: "床是長方形的。",
    hint: "變形超人！陰性 a cama 搭配 retangular 同樣不變形！"
  },
  {
    id: "rec_f_3",
    english: "a piscina",
    portuguese: "a piscina",
    chinese: "游泳池 (陰性)",
    emoji: "🏊‍♀️",
    chapter: "3. 長方形組 (Retangular)",
    gender: "f",
    article: "a",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "A piscina é retangular.",
    sentenceChinese: "游泳池是長方形的。",
    hint: "變形超人！陰性 a piscina 搭配 retangular 同樣不變形！"
  },
  {
    id: "rec_f_4",
    english: "a porta",
    portuguese: "a porta",
    chinese: "大門 (陰性)",
    emoji: "🚪",
    chapter: "3. 長方形組 (Retangular)",
    gender: "f",
    article: "a",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "A porta é retangular.",
    sentenceChinese: "門是長方形的。",
    hint: "變形超人！陰性 a porta 搭配 retangular 同樣不變形！"
  },

  // 4. 核心形容詞（Adjetivos de Formas）
  {
    id: "adj_1",
    english: "redondo",
    portuguese: "redondo",
    chinese: "圓形的 (陽性結尾 -o)",
    emoji: "🔵",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "m",
    article: "",
    shape: "circle",
    targetAdj: "redondo",
    exampleSentence: "O sol é redondo.",
    sentenceChinese: "陽性名詞配 -o (redondo)。",
    hint: "結尾為 -o，配陽性名詞 (o ...)！"
  },
  {
    id: "adj_2",
    english: "redonda",
    portuguese: "redonda",
    chinese: "圓形的 (陰性結尾 -a)",
    emoji: "🌸",
    chapter: "1. 圓形組 (Redondo/a)",
    gender: "f",
    article: "",
    shape: "circle",
    targetAdj: "redonda",
    exampleSentence: "A bola é redonda.",
    sentenceChinese: "陰性名詞配 -a (redonda)。",
    hint: "結尾為 -a，配陰性名詞 (a ...)！"
  },
  {
    id: "adj_3",
    english: "quadrado",
    portuguese: "quadrado",
    chinese: "正方形的 (陽性結尾 -o)",
    emoji: "🟢",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "m",
    article: "",
    shape: "square",
    targetAdj: "quadrado",
    exampleSentence: "O quadro é quadrado.",
    sentenceChinese: "陽性名詞配 -o (quadrado)。",
    hint: "結尾為 -o，配陽性名詞 (o ...)！"
  },
  {
    id: "adj_4",
    english: "quadrada",
    portuguese: "quadrada",
    chinese: "正方形的 (陰性結尾 -a)",
    emoji: "🌿",
    chapter: "2. 正方形組 (Quadrado/a)",
    gender: "f",
    article: "",
    shape: "square",
    targetAdj: "quadrada",
    exampleSentence: "A caixa é quadrada.",
    sentenceChinese: "陰性名詞配 -a (quadrada)。",
    hint: "結尾為 -a，配陰性名詞 (a ...)！"
  },
  {
    id: "adj_5",
    english: "retangular",
    portuguese: "retangular",
    chinese: "長方形的 (陰陽同形 變形超人 ⭐)",
    emoji: "⭐",
    chapter: "3. 長方形組 (Retangular)",
    gender: "both",
    article: "",
    shape: "rectangle",
    targetAdj: "retangular",
    exampleSentence: "O livro é retangular. A régua é retangular.",
    sentenceChinese: "結尾 -ar，男女生都一樣不變！",
    hint: "單一形式形容詞：結尾為 -ar，陰陽性同形！"
  }
];

// Food kingdom special list
export const FOOD_WORDS: Word[] = WORD_LIST.filter(w => w.isFood);
