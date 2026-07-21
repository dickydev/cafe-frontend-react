const STORAGE_KEY = "cafe-lab-loyalty-xp";
const EVENT_NAME = "cafe-lab-loyalty-updated";

export function getLoyaltyXp() {
  if (typeof window === "undefined") return 20;
  return Number(window.localStorage.getItem(STORAGE_KEY) || 20);
}

export function addLoyaltyXp(amount) {
  if (typeof window === "undefined") return 20;
  const next = Math.max(0, getLoyaltyXp() + Number(amount || 0));
  window.localStorage.setItem(STORAGE_KEY, String(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { xp: next, amount } }));
  return next;
}

export function getLoyaltyProfile(xp = getLoyaltyXp()) {
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  const tier = xp >= 600 ? "Mythic" : xp >= 300 ? "Gold" : xp >= 100 ? "Silver" : "Bronze";
  return { xp, level, progress, tier, nextLevelXp: 100 - progress };
}

export const loyaltyEventName = EVENT_NAME;
