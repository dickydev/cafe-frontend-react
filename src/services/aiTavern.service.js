import { menuItems } from "../data/cafeData";
import { formatRupiah } from "../utils/formatRupiah";

const normalize = (value = "") => value.toLowerCase().trim();
const AI_API_URL = (import.meta.env.VITE_AI_API_URL || "").replace(/\/$/, "");

async function requestRemoteAi(path, payload) {
  if (!AI_API_URL) return null;
  try {
    const response = await fetch(`${AI_API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function extractBudget(prompt) {
  const text = normalize(prompt).replace(/\./g, "");
  const match = text.match(/(?:budget|maks(?:imal)?|max|punya)?\s*(?:rp\s*)?(\d{2,6})(?:\s*(ribu|rb|k))?/i);
  if (!match) return null;
  const raw = Number(match[1]);
  if (!Number.isFinite(raw)) return null;
  return match[2] || raw < 1000 ? raw * 1000 : raw;
}

function scoreItem(item, prompt) {
  const text = normalize(prompt);
  const haystack = normalize(`${item.name} ${item.description} ${item.tags.join(" ")} ${item.category} ${item.dietary.join(" ")}`);
  let score = item.rating * 2;

  const preferenceRules = [
    [/(pedas|spicy|sambal)/, ["spicy", "sambal"]],
    [/(manis|sweet|dessert)/, ["sweet", "dessert", "waffle", "churros"]],
    [/(kopi|coffee|kafein)/, ["coffee", "espresso", "brew", "latte"]],
    [/(segar|refreshing|dingin|cold)/, ["refreshing", "cold", "berry"]],
    [/(kenyang|lapar berat|heavy|makan besar)/, ["main", "rice", "pasta", "pizza", "chicken"]],
    [/(sharing|rame|bersama|teman)/, ["sharing", "pizza", "fries", "wings"]],
    [/(vegetarian|tanpa daging)/, ["vegetarian"]],
    [/(vegan)/, ["vegan"]],
    [/(halal)/, ["halal"]],
    [/(protein|gym|fit)/, ["protein", "chicken"]],
  ];

  preferenceRules.forEach(([pattern, keywords]) => {
    if (pattern.test(text) && keywords.some((keyword) => haystack.includes(keyword))) score += 8;
  });

  if (/tidak suka kopi|tanpa kopi|no coffee/.test(text) && item.category === "coffee") score -= 40;
  if (/tidak suka manis|kurang manis|no sugar/.test(text) && (haystack.includes("sweet") || item.category === "dessert")) score -= 30;
  if (/tidak suka seafood|tanpa seafood|no seafood/.test(text) && haystack.includes("seafood")) score -= 100;
  if (/vegetarian|tanpa daging/.test(text) && !item.dietary.includes("vegetarian") && !item.dietary.includes("vegan")) score -= 100;
  if (/vegan/.test(text) && !item.dietary.includes("vegan")) score -= 100;

  return score;
}

function buildCombination(sortedItems, budget, prompt) {
  const text = normalize(prompt);
  const wantsHeavy = /(lapar berat|kenyang|heavy|makan besar)/.test(text);
  const wantsDrink = !/(tanpa minum|no drink)/.test(text);
  const selected = [];
  let total = 0;

  const tryAdd = (item) => {
    if (!item || selected.some((entry) => entry.id === item.id)) return;
    if (budget && total + item.price > budget) return;
    selected.push(item);
    total += item.price;
  };

  if (wantsHeavy) tryAdd(sortedItems.find((item) => item.category === "main"));
  if (wantsDrink) tryAdd(sortedItems.find((item) => item.category === "coffee"));

  sortedItems.forEach((item) => {
    if (selected.length >= 3) return;
    tryAdd(item);
  });

  if (selected.length === 0 && budget) {
    const cheapest = [...sortedItems].sort((a, b) => a.price - b.price)[0];
    if (cheapest) tryAdd(cheapest);
  }

  return { selected, total };
}

export async function getMenuRecommendation(prompt) {
  const remote = await requestRemoteAi("/recommend-menu", { prompt, menuItems });
  if (remote?.items?.length) return remote;

  const budget = extractBudget(prompt);
  const sorted = [...menuItems]
    .map((item) => ({ ...item, aiScore: scoreItem(item, prompt) }))
    .filter((item) => item.aiScore > -50)
    .sort((a, b) => b.aiScore - a.aiScore || a.price - b.price);

  const { selected, total } = buildCombination(sorted, budget, prompt);
  const remaining = budget ? Math.max(budget - total, 0) : null;

  let summary = "Aku memilih kombinasi yang seimbang berdasarkan selera dan suasana kunjunganmu.";
  if (budget) {
    summary = total <= budget
      ? `Kombinasi ini masih aman di budget ${formatRupiah(budget)}${remaining ? `, dengan sisa sekitar ${formatRupiah(remaining)}` : ""}.`
      : `Pilihan terdekat dengan budget ${formatRupiah(budget)}.`;
  }

  return {
    id: `rec-${Date.now()}`,
    prompt,
    items: selected,
    total,
    budget,
    summary,
    reasoning: selected.map((item) => {
      if (item.category === "main") return `${item.name} menjadi sumber makanan utama yang mengenyangkan.`;
      if (item.category === "coffee") return `${item.name} melengkapi makanan dengan minuman ber-rating ${item.rating}.`;
      return `${item.name} menambah variasi rasa dan cocok untuk dinikmati santai.`;
    }),
  };
}

const npcResponses = {
  menu: "Untuk pilihan aman, aku menyarankan satu main course dan satu signature drink. Ceritakan budget serta rasa yang kamu suka agar ramalanku lebih tepat.",
  game: "UNO cocok untuk suasana ramai, Jenga untuk ketegangan lucu, Chess untuk duel strategi, sedangkan Ludo paling nyaman untuk keluarga.",
  quest: "Quest hari ini memberi XP tambahan saat kamu mencoba menu, bermain, atau datang bersama teman. Buka Quest Board untuk melihat progresmu.",
  cafe: "Cafe Lab adalah tavern modern: tempat makan, bermain, bekerja, dan membangun cerita bersama teman.",
};

export async function getNpcReply(message, context = {}) {
  const remote = await requestRemoteAi("/npc-chat", { message, context });
  if (remote?.reply) return remote;

  const text = normalize(message);
  let reply = "Aku mendengarkan, traveler. Kamu dapat menanyakan menu, aktivitas, quest, reservasi, atau meminta rekomendasi berdasarkan budget.";

  if (/(menu|makan|minum|lapar|budget)/.test(text)) reply = npcResponses.menu;
  else if (/(game|uno|jenga|catur|chess|ludo|main)/.test(text)) reply = npcResponses.game;
  else if (/(quest|xp|reward|hadiah|level)/.test(text)) reply = npcResponses.quest;
  else if (/(cafe|tempat|tentang|about)/.test(text)) reply = npcResponses.cafe;
  else if (/(halo|hai|hello|pagi|siang|malam)/.test(text)) reply = `Salam, ${context.name || "traveler"}. Aku Arka, Tavern Master Cafe Lab. Level hubungan kita akan naik setiap kali kamu berbicara dan menyelesaikan quest.`;

  return {
    reply,
    xp: 5,
    mood: text.includes("terima kasih") ? "delighted" : "helpful",
  };
}

export function getDailyQuests(dateKey = new Date().toISOString().slice(0, 10)) {
  const seed = dateKey.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const quests = [
    {
      id: "drink-duo",
      title: "Mana Potion Pair",
      description: "Tambahkan 2 minuman ke combo.",
      target: 2,
      metric: "drinks",
      rewardXp: 35,
      reward: "Badge Potion Brewer",
      icon: "🧪",
    },
    {
      id: "game-night",
      title: "Open the Game Chest",
      description: "Pilih minimal 1 aktivitas untuk kunjunganmu.",
      target: 1,
      metric: "activities",
      rewardXp: 30,
      reward: "Bonus game time 15 menit",
      icon: "🎲",
    },
    {
      id: "party-four",
      title: "Gather the Party",
      description: "Buat reservasi untuk 4 orang atau lebih.",
      target: 4,
      metric: "guests",
      rewardXp: 50,
      reward: "Rare Party Card",
      icon: "🛡️",
    },
    {
      id: "new-flavor",
      title: "Discover a New Flavor",
      description: "Tambahkan menu bertanda new atau signature.",
      target: 1,
      metric: "discovery",
      rewardXp: 25,
      reward: "Achievement Flavor Scout",
      icon: "✨",
    },
  ];

  return [quests[seed % quests.length], quests[(seed + 1) % quests.length], quests[(seed + 3) % quests.length]];
}

export const triviaQuestions = {
  teknologi: [
    { question: "Apa kepanjangan dari HTML?", options: ["HyperText Markup Language", "High Transfer Machine Language", "Home Tool Markup Language", "Hyperlink Text Machine Logic"], answer: 0 },
    { question: "Framework UI berbasis komponen yang digunakan project ini?", options: ["Laravel", "React", "Django", "Spring"], answer: 1 },
    { question: "HTTP status untuk permintaan berhasil secara umum?", options: ["200", "404", "500", "301"], answer: 0 },
  ],
  anime: [
    { question: "Dalam banyak cerita fantasy, mana biasanya digunakan untuk?", options: ["Mata uang", "Energi sihir", "Nama kerajaan", "Jenis armor"], answer: 1 },
    { question: "Istilah untuk karakter lawan utama dalam cerita?", options: ["Protagonis", "Narator", "Antagonis", "Figuran"], answer: 2 },
    { question: "Genre yang membawa karakter ke dunia lain dikenal sebagai?", options: ["Isekai", "Seinen", "Slice of life", "Mecha"], answer: 0 },
  ],
  film: [
    { question: "Siapa yang biasanya bertanggung jawab mengarahkan proses kreatif film?", options: ["Sutradara", "Penonton", "Kasir", "Kritikus"], answer: 0 },
    { question: "Adegan tambahan setelah credit disebut?", options: ["Cold open", "Post-credit scene", "Pilot", "B-roll"], answer: 1 },
    { question: "Musik original pendukung film disebut?", options: ["Storyboard", "Soundtrack", "Subtitle", "Trailer"], answer: 1 },
  ],
  sepakbola: [
    { question: "Berapa jumlah pemain utama satu tim di lapangan?", options: ["9", "10", "11", "12"], answer: 2 },
    { question: "Tendangan dari titik penalti berjarak sekitar?", options: ["7 meter", "9 meter", "11 meter", "15 meter"], answer: 2 },
    { question: "Kartu merah berarti?", options: ["Peringatan ringan", "Pemain keluar", "Pergantian pemain", "Tambahan waktu"], answer: 1 },
  ],
  umum: [
    { question: "Planet terbesar di tata surya?", options: ["Mars", "Bumi", "Jupiter", "Venus"], answer: 2 },
    { question: "Benua terluas di dunia?", options: ["Afrika", "Asia", "Eropa", "Australia"], answer: 1 },
    { question: "Air membeku pada suhu?", options: ["0°C", "10°C", "50°C", "100°C"], answer: 0 },
  ],
};

export async function generateCampaign({ goal, audience, tone }) {
  const remote = await requestRemoteAi("/generate-campaign", { goal, audience, tone });
  if (remote?.name) return remote;

  const normalizedGoal = goal.trim() || "meningkatkan penjualan minuman";
  const target = audience || "pelanggan aktif";
  const campaignTone = tone || "playful";

  return {
    name: "Potion Rush Week",
    headline: "Upgrade minumanmu, kumpulkan XP, unlock reward!",
    rationale: `Campaign ini dirancang untuk ${normalizedGoal} dengan target ${target} dan gaya komunikasi ${campaignTone}.`,
    promo: "Beli 2 signature drinks, dapat bonus 40 XP dan kesempatan membuka Mystery Reward.",
    quest: "Selesaikan Mana Potion Pair sebanyak dua kali minggu ini.",
    reward: "Diskon 20% snack pada kunjungan berikutnya.",
    notification: "Tavern Master memanggil! Potion Rush Week dimulai hari ini. Siapkan party-mu dan kumpulkan XP sebelum Minggu malam.",
    channels: ["In-app banner", "WhatsApp broadcast", "Instagram Story", "QR table tent"],
  };
}

export const ownerInsights = {
  summary: [
    { label: "Revenue minggu ini", value: "Rp18,4 jt", change: "+12,8%", positive: true },
    { label: "Average order", value: "Rp76.500", change: "+6,2%", positive: true },
    { label: "Quest completion", value: "68%", change: "+14%", positive: true },
    { label: "Returning guests", value: "41%", change: "-2,1%", positive: false },
  ],
  topProducts: [
    { name: "Signature Aren Latte", profit: 82, sales: 126, insight: "Margin tinggi dan kuat sebagai hero product." },
    { name: "Truffle Mushroom Pasta", profit: 74, sales: 91, insight: "Sering dibeli bersama signature drink." },
    { name: "Smoked Beef Thin Crust", profit: 69, sales: 78, insight: "Paling efektif untuk party 3–5 orang." },
    { name: "Berry Cold Brew", profit: 55, sales: 43, insight: "Perlu campaign sampling pada jam sore." },
  ],
  busyHours: [
    { hour: "10", value: 32 }, { hour: "12", value: 58 }, { hour: "14", value: 66 },
    { hour: "16", value: 48 }, { hour: "18", value: 83 }, { hour: "20", value: 96 },
  ],
  customerSegments: [
    { name: "Gamer Aktif", share: 31, description: "Sering memilih aktivitas, rata-rata durasi kunjungan 2,1 jam.", strategy: "Tawarkan tournament night dan party bundle." },
    { name: "Pemburu Diskon", share: 27, description: "Responsif terhadap quest dan limited-time reward.", strategy: "Gunakan streak quest, bukan diskon langsung terus-menerus." },
    { name: "Keluarga", share: 23, description: "Datang akhir pekan, memilih menu sharing dan Ludo.", strategy: "Buat family combo dengan reservasi prioritas." },
    { name: "Pelanggan Loyal", share: 19, description: "Frekuensi tinggi dan cenderung mencoba menu baru.", strategy: "Berikan NPC story unlock dan preview menu khusus." },
  ],
};
