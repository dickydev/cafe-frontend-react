import { formatRupiah } from "../utils/formatRupiah";
import React, { useState } from "react";
import { Coffee, Sandwich, Utensils, IceCream, Gamepad } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = {
  drinks: [
    { name: "Espresso", price: 120, icon: <Coffee /> },
    { name: "Latte", price: 150, icon: <Coffee /> },
    { name: "Cappuccino", price: 160, icon: <Coffee /> },
    { name: "Hot Chocolate", price: 140, icon: <Coffee /> },
  ],
  mains: [
    { name: "Grilled Sandwich", price: 200, icon: <Sandwich /> },
    { name: "Pasta Bowl", price: 250, icon: <Utensils /> },
    { name: "Caesar Salad", price: 180, icon: <Utensils /> },
    { name: "Veg Wrap", price: 150, icon: <Sandwich /> },
  ],
  desserts: [
    { name: "Chocolate Cake", price: 150, icon: <IceCream /> },
    { name: "Waffle", price: 180, icon: <IceCream /> },
    { name: "Brownie", price: 130, icon: <IceCream /> },
    { name: "Ice Cream Scoop", price: 120, icon: <IceCream /> },
  ],
  games: [
    { name: "Chess", icon: <Gamepad /> },
    { name: "Jenga", icon: <Gamepad /> },
    { name: "Monopoly", icon: <Gamepad /> },
    { name: "Scrabble", icon: <Gamepad /> },
    { name: "Ludo", icon: <Gamepad /> },
    { name: "Snakes & Ladders", icon: <Gamepad /> },
    { name: "Uno Cards", icon: <Gamepad /> },
  ],
};

export default function ExperiencePlanner() {
  const [combo, setCombo] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);

  const addItem = (item) => setCombo([...combo, item]);
  const removeItem = (index) =>
    setCombo(combo.filter((_, i) => i !== index));
  const toggleGame = (game) =>
    selectedGames.includes(game)
      ? setSelectedGames(selectedGames.filter((g) => g !== game))
      : setSelectedGames([...selectedGames, game]);

  const totalPrice = combo.reduce((acc, item) => acc + item.price, 0);

  const categories = [
    { key: "drinks", sticker: "/coffee.webp", emoji: "☕" },
    { key: "mains", sticker: "/pasta.webp", emoji: "🍲" },
    { key: "desserts", sticker: "/waffle.webp", emoji: "🍨" },
  ];

  return (
    <div
      className="min-h-screen px-6 py-16 font-serif text-gray-900"
      style={{
        backgroundImage: 'url("/background.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <h1 className="text-5xl font-bold text-center mb-12 drop-shadow-lg">
        Build Your Cafe Experience
      </h1>

      {/* Section 1: Create Your Own Combo */}
      <section className="mb-16 max-w-6xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          🎨 Create Your Own Combo
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {categories.map(({ key, sticker, emoji }) => (
            <div key={key} className="space-y-2 relative">
              <img
                src={sticker}
                alt={`${key} sticker`}
                className="absolute top-0 right-0 w-32 h-32 -translate-y-1/4 translate-x-1/4 opacity-60 pointer-events-none"
              />
              <h3 className="text-xl font-semibold text-gray-700 capitalize">
                {emoji} {key}
              </h3>
              <div className="flex flex-wrap gap-3">
                {menuItems[key].map((item, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => addItem(item)}
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-lg shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer border border-gray-200"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <span className="font-semibold">₹{formatRupiah(item.price)}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Combo Preview */}
        <div className="bg-white/50 backdrop-blur-xl p-4 rounded-2xl shadow-inner mt-6 min-h-[150px]">
          <h3 className="text-2xl font-semibold mb-4">Your Combo Preview</h3>
          {combo.length === 0 ? (
            <p className="text-gray-600">Click items above to add to your combo.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {combo.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 backdrop-blur-lg shadow hover:scale-105 transition cursor-pointer border border-gray-200"
                  onClick={() => removeItem(idx)}
                >
                  {item.icon || <Utensils />}
                  <span>{item.name}</span>
                  <span className="font-semibold">₹{formatRupiah(item.price)}</span>
                  <span className="text-red-500 font-bold ml-1 cursor-pointer">×</span>
                </motion.div>
              ))}
            </div>
          )}
          <p className="mt-4 text-xl font-semibold text-gray-800">
            Total: ₹{totalPrice}
          </p>
        </div>
      </section>

      {/* Section 2: Cafe Experience Planner */}
      <section className="max-w-6xl mx-auto bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2 relative">
          🎲 Cafe Experience Planner
          {/* Floating stickers behind text */}
            <div className="absolute flex gap-4 pointer-events-none -z-10
                  top-[-1rem] sm:top-[-1.5rem] md:top-[-2rem]
                  right-2 sm:right-4 md:right-6 lg:right-8
                  opacity-70">
            <img
              src="/chess.webp"
              alt="Chess Sticker"
              className="w-28 h-28 rotate-[10deg] sm:rotate-[10deg] md:rotate-[0deg]"
            />
            <img
              src="/jenga.webp"
              alt="Jenga Sticker"
              className="w-28 h-28 rotate-[-10deg] sm:rotate-[-10deg] md:rotate-[0deg]"
            />
          </div>
        </h2>

        <p className="mb-4 text-gray-700">
          Choose the games you'd like to play and preview your table setup:
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {menuItems.games.map((game, idx) => (
            <motion.button
              key={idx}
              onClick={() => toggleGame(game.name)}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: selectedGames.includes(game.name) ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl shadow-md transition ${
                selectedGames.includes(game.name)
                  ? "bg-green-200"
                  : "bg-white/70 hover:scale-[1.03] backdrop-blur-lg"
              }`}
            >
              {game.icon}
              <span>{game.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl shadow-inner min-h-[150px] flex flex-wrap items-center justify-center gap-4 mt-8">

          {selectedGames.length === 0 ? (
            <p className="text-gray-600">Select games above to book them for your table.</p>
          ) : (
            selectedGames.map((game, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/80 backdrop-blur-lg shadow"
              >
                <Gamepad className="w-8 h-8 text-gray-700 mb-1" />
                <span>{game}</span>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
