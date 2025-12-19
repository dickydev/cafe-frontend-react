import React, { useMemo, useState } from 'react';
import { formatRupiah } from '../utils/formatRupiah';

// ---------------------- Utilities ----------------------

// Tokenize a string into simple tokens (lowercase words, remove punctuation)
const tokenize = (str) => {
  if (!str) return [];
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]"]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
};

// Lightweight keyword-to-tag mapping: common café-related keywords -> normalized tags
const KEYWORD_TAG_MAP = {
  coffee: ['coffee','espresso','latte','cappuccino','americano','mocha','macchiato'],
  tea: ['tea','matcha','chai','teh','earl','oolong'],
  pastry: ['croissant','muffin','cake','pastry','bagel','donut','scone'],
  dessert: ['tiramisu','cheesecake','dessert','pudding','brownie'],
  cold: ['iced','cold','frappe','frappé','frozen'],
  hot: ['hot','steaming','warm'],
  sweet: ['syrup','sweet','vanilla','caramel','honey','sugar','chocolate'],
  savory: ['savory','cheese','ham','bacon','salami','savory'],
  spicy: ['spicy','chili','chile','pepper'],
  healthy: ['salad','healthy','quinoa','avocado','greek'],
  dairy: ['milk','cream','cheese'],
  vegan: ['vegan','plant-based','dairy-free'],
  breakfast: ['breakfast','morning','oat','granola'],
  snack: ['snack','small','bite','light']
};

// Infer tags from name/description using keyword map
const inferTags = (item) => {
  const text = [item.name || '', item.description || ''].join(' ');
  const tokens = tokenize(text);
  const tags = new Set(item.tags || []);
  Object.entries(KEYWORD_TAG_MAP).forEach(([tag, keywords]) => {
    keywords.forEach((kw) => {
      if (tokens.includes(kw)) tags.add(tag);
    });
  });
  // also push explicit category if item.category exists
  if (item.category) tags.add(String(item.category).toLowerCase());
  return Array.from(tags);
};

// Build feature vocabulary from all items' tags
const buildVocabulary = (items) => {
  const vocab = new Set();
  items.forEach((it) => {
    const tags = it.tags && it.tags.length ? it.tags : inferTags(it);
    tags.forEach((t) => vocab.add(t));
  });
  return Array.from(vocab);
};

// Convert item tags to a binary vector according to vocabulary order
const tagsToVector = (tags, vocab) => {
  const set = new Set(tags);
  return vocab.map((v) => (set.has(v) ? 1 : 0));
};

// Cosine similarity for two numeric vectors
const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

// Build vectors map for quick lookup
const buildItemVectors = (items, vocab) => {
  const map = {};
  items.forEach((it) => {
    const tags = it.tags && it.tags.length ? it.tags : inferTags(it);
    map[it.id ?? it.name] = {
      id: it.id ?? it.name,
      tags,
      vector: tagsToVector(tags, vocab)
    };
  });
  return map;
};

// Main recommendation function: returns sorted list of items with similarity score
const recommendContentBased = (items, selectedIdOrName, topK = 4) => {
  if (!items || items.length === 0) return [];
  const vocab = buildVocabulary(items);
  const vectors = buildItemVectors(items, vocab);
  const selectedKey = selectedIdOrName;
  const selected = vectors[selectedKey];
  if (!selected) return [];
  const results = [];
  Object.values(vectors).forEach((v) => {
    if (v.id === selected.id) return; // skip same item
    const sim = cosineSimilarity(selected.vector, v.vector);
    results.push({ id: v.id, similarity: sim });
  });
  results.sort((a, b) => b.similarity - a.similarity);
  const top = results.slice(0, topK).filter(r => r.similarity > 0);
  // map back to full item objects with score
  return top.map((r) => {
    const item = items.find(it => (it.id ?? it.name) === r.id);
    return { ...item, score: r.similarity };
  });
};

// ---------------------- React Component ----------------------

export default function Recommendation({ menu = [], initialSelectedId = null, maxRecommendations = 4 }) {
  // menu: array of items. Each item ideally has { id, name, description, price, tags }
  const [selectedId, setSelectedId] = useState(initialSelectedId || (menu[0] ? (menu[0].id ?? menu[0].name) : null));

  // memoize computation for efficiency
  const recommendations = useMemo(() => {
    if (!selectedId) return [];
    return recommendContentBased(menu, selectedId, maxRecommendations);
  }, [menu, selectedId, maxRecommendations]);

  const handleSelect = (e) => {
    setSelectedId(e.target.value);
  };

  return (
    <div className="p-4 bg-white/5 rounded-xl shadow-sm"> 
      <h2 className="text-xl font-semibold mb-3">Rekomendasi Untukmu</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Pilih item untuk melihat rekomendasi:</label>
        <select value={selectedId ?? ''} onChange={handleSelect} className="w-full p-2 rounded-md bg-white/10">
          {menu.map((it) => (
            <option key={it.id ?? it.name} value={it.id ?? it.name}>
              {it.name} {it.price ? ` - ${formatRupiah(it.price)}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.length === 0 ? (
          <div className="p-4 bg-white/10 rounded">Tidak ada rekomendasi untuk item ini.</div>
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="p-3 bg-white/10 rounded flex items-start gap-3">
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{rec.name}</h3>
                  <div className="text-sm">{rec.score !== undefined ? (rec.score > 0 ? (rec.score * 100).toFixed(0) + '%' : '') : ''}</div>
                </div>
                {rec.description && <p className="text-sm mt-1">{rec.description}</p>}
                <div className="mt-2 font-bold">{rec.price ? formatRupiah(rec.price) : ''}</div>
                {rec.tags && rec.tags.length > 0 && (
                  <div className="mt-2 text-xs text-white/70">Tags: {rec.tags.join(', ')}</div>
                )}
              </div>
              <div>
                <button
                  onClick={() => {
                    // dispatch or callback integration point: e.g., add to combo
                    // For now, just an affordance
                    alert(`Tambah ${rec.name} ke combo`);
                  }}
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                >
                  Tambah
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-xs text-white/60">
        <strong>Catatan teknis:</strong> Rekomendasi berbasis kemiripan fitur (tags). Untuk hasil terbaik,
        tambahkan `tags` ke setiap item menu (contoh: ['coffee','hot','sweet']). Jika tags tak ada,
        sistem akan mencoba menebak tags dari nama/deskripsi.
      </div>
    </div>
  );
}
