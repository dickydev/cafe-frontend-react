import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { formatRupiah } from "../utils/formatRupiah";
import Recommendation from "../components/Recommendation";

const menuData = {
  coffee: {
    hot: [
      { name: "Kopi Tubruk", price: 10000 },
      { name: "Kopi Hitam Arabica", price: 15000 },
      { name: "Cappuccino", price: 23000 },
      { name: "Caffè Latte", price: 24000 },
      { name: "Kopi Susu Gula Aren", price: 20000 },
      { name: "Hot Chocolate", price: 22000 },
      { name: "Teh Tarik", price: 18000 },
      { name: "Wedang Jahe", price: 15000 },
    ],
    cold: [
      { name: "Es Kopi Susu Gula Aren", price: 22000 },
      { name: "Es Americano", price: 18000 },
      { name: "Es Latte", price: 23000 },
      { name: "Hazelnut Latte", price: 25000 },
      { name: "Caramel Macchiato", price: 26000 },
      { name: "Es Teh Manis", price: 8000 },
      { name: "Es Jeruk", price: 12000 },
      { name: "Milkshake Cokelat", price: 25000 },
      { name: "Milkshake Stroberi", price: 25000 },
      { name: "Es Cokelat", price: 20000 },
    ],
  },
  appetizers: [
    { name: "Pisang Goreng Keju", price: 18000 },
    { name: "Roti Bakar Coklat Keju", price: 20000 },
    { name: "Kentang Goreng", price: 17000 },
    { name: "Singkong Keju", price: 16000 },
    { name: "Tahu Crispy", price: 15000 },
    { name: "Tempe Mendoan", price: 15000 },
    { name: "Sosis Bakar", price: 20000 },
    { name: "Bakso Goreng", price: 18000 },
    { name: "Onion Rings", price: 19000 },
    { name: "Chicken Wings", price: 28000 },
    { name: "Cireng Bumbu Rujak", price: 15000 },
    { name: "Dimsum Ayam", price: 22000 },
  ],
  main: [
    { name: "Nasi Goreng Special", price: 30000 },
    { name: "Mie Goreng Jawa", price: 28000 },
    { name: "Nasi Ayam Geprek", price: 27000 },
    { name: "Spaghetti Bolognese", price: 32000 },
    { name: "Spaghetti Carbonara", price: 35000 },
    { name: "Chicken Steak", price: 38000 },
    { name: "Rice Bowl Teriyaki", price: 33000 },
    { name: "Rice Bowl Sambal Matah", price: 32000 },
    { name: "Pizza Mini Mozzarella", price: 45000 },
  ],
  desserts: [
    { name: "Brownies Ice Cream", price: 25000 },
    { name: "Es Pisang Ijo", price: 20000 },
    { name: "Pudding Cokelat", price: 18000 },
    { name: "Pancake Maple Syrup", price: 24000 },
    { name: "Cheesecake Blueberry", price: 32000 },
    { name: "Tiramisu Cup", price: 30000 },
    { name: "Waffle Ice Cream", price: 28000 },
    { name: "Churros with Chocolate Dip", price: 26000 },
    { name: "Mochi Ice Cream", price: 24000 },
    { name: "Klepon Cake", price: 22000 },
  ],
};

// Ubah menuData yang nested menjadi array datar untuk komponen Recommendation
const buildFlatMenu = (data) => {
  const flat = [];
  Object.entries(data).forEach(([category, value]) => {
    // Jika kategori langsung berisi array
    if (Array.isArray(value)) {
      value.forEach((item, idx) =>
        flat.push({
          id: `${category}-${idx}`,
          name: item.name,
          price: item.price,
          category,
        })
      );
    } else {
      // misal coffee: {hot: [...], cold: [...]}
      Object.entries(value).forEach(([sub, arr]) => {
        arr.forEach((item, idx) =>
          flat.push({
            id: `${category}-${sub}-${idx}`,
            name: item.name,
            price: item.price,
            category: `${category}-${sub}`,
          })
        );
      });
    }
  });
  return flat;
};

export default function Menu() {
  const location = useLocation();
  const flatMenu = useMemo(() => buildFlatMenu(menuData), []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const initialId = flatMenu.length > 0 ? flatMenu[0].id : null;

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
      <h1 className="text-5xl font-bold text-center mb-14 drop-shadow-lg">
        Menu Kami
      </h1>

      {/* Coffee Section */}
      <section
        id="coffee"
        className="relative mb-16 bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8"
      >
        <img src="/coffee.webp" alt="Coffee Sticker" className="absolute w-32 h-32 opacity-80 pointer-events-none -z-10 
          top-[-1rem] right-2 -translate-y-1/4 translate-x-1/4" />
        <h2 className="text-3xl font-semibold mb-6 tracking-wide text-gray-800">
          ☕ Kopi & Minuman
        </h2>

        <h3 className="text-2xl font-medium mb-4">Hot</h3>
        <ul className="grid md:grid-cols-2 gap-5 mb-8">
          {menuData.coffee.hot.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center bg-white/60 p-5 rounded-2xl shadow-md hover:scale-[1.02] transition-all">
              <span>{item.name}</span>
              <span className="font-semibold">{formatRupiah(item.price)}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-2xl font-medium mb-4">Cold</h3>
        <ul className="grid md:grid-cols-2 gap-5">
          {menuData.coffee.cold.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center bg-white/60 p-5 rounded-2xl shadow-md hover:scale-[1.02] transition-all">
              <span>{item.name}</span>
              <span className="font-semibold">{formatRupiah(item.price)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Other Categories */}
      {[
        { key: "appetizers", sticker: "/sandwich.webp" },
        { key: "main", sticker: "/pasta.webp" },
        { key: "desserts", sticker: "/waffle.webp" },
      ].map(({ key, sticker }) => (
        <section key={key} id={key} className="relative mb-16 bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8">
          <img src={sticker} alt={`${key} Sticker`} className="absolute w-32 h-32 opacity-80 pointer-events-none -z-10 top-[-1rem] right-2 -translate-y-1/4 translate-x-1/4" />
          <h2 className="text-3xl font-semibold mb-6 capitalize">
            {key === "appetizers" ? "🥪 Appetizer" : key === "main" ? "🍲 Main Course" : "🍨 Dessert"}
          </h2>
          <ul className="grid md:grid-cols-2 gap-5">
            {menuData[key].map((item, idx) => (
              <li key={idx} className="flex justify-between items-center bg-white/60 p-5 rounded-2xl shadow-md hover:scale-[1.02] transition-all">
                <span>{item.name}</span>
                <span className="font-semibold">{formatRupiah(item.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* ✅ Tambahkan rekomendasi di sini */}
      <section id="recommendation" className="mt-20 mb-10">
        <Recommendation
          menu={flatMenu}
          initialSelectedId={initialId}
          maxRecommendations={4}
        />
      </section>
    </div>
  );
}
