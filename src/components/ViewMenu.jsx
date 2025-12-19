import React, { useState } from "react"; 
import { Coffee, IceCream, Utensils, Sandwich } from "lucide-react";
import { Link } from "react-router-dom";

export default function ViewMenu() {
  const [showIcons, setShowIcons] = useState(false);

  return (
    <div className="fixed top-6 left-6 z-50">
      <div
        onMouseEnter={() => setShowIcons(true)}
        onMouseLeave={() => setShowIcons(false)}
        className="relative"
      >
        {/* View Menu Button */}
        <Link to="/menu">
          <button className="px-5 py-2 rounded-full bg-gray-900 text-white shadow-lg hover:scale-105 transition">
            View Menu
          </button>
        </Link>

        {/* Hover icons */}
        {showIcons && (
          <div className="flex gap-3 mt-3">
            {/* Coffee */}
            <Link to="/menu#coffee">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#6f4e37]/30 shadow hover:scale-110 transition">
                <Coffee className="w-6 h-6 text-[#4b2e23]" />
              </div>
            </Link>

            {/* Appetizers */}
            <Link to="/menu#appetizers">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#8b5e3c]/30 shadow hover:scale-110 transition">
                <Sandwich className="w-6 h-6 text-[#593d2b]" />
              </div>
            </Link>

            {/* Main Course */}
            <Link to="/menu#main">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#7a4b2c]/30 shadow hover:scale-110 transition">
                <Utensils className="w-6 h-6 text-[#482c1f]" />
              </div>
            </Link>

            {/* Desserts */}
            <Link to="/menu#desserts">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#a9746e]/30 shadow hover:scale-110 transition">
                <IceCream className="w-6 h-6 text-[#6b3f36]" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
