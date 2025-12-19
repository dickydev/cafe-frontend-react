import React from "react";
import { Link } from "react-router-dom";
import { Home, Phone, ShoppingCart, List } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-4 right-6 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex gap-6 items-center z-50">
      <Link to="/" className="hover:text-green-700 transition"><Home size={22} /></Link>
      <Link to="/about" className="hover:text-green-700 transition"><Phone size={22} /></Link>
      <Link to="/cart" className="hover:text-green-700 transition"><ShoppingCart size={22} /></Link>
      <Link to="/menu" className="hover:text-green-700 transition"><List size={22} /></Link>
    </nav>
  );
}
