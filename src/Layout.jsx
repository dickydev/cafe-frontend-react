import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TavernAssistantBubble from "./components/ai/TavernAssistantBubble";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-stone-950">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <TavernAssistantBubble />
    </div>
  );
}
