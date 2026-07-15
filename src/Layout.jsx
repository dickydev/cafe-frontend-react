import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-stone-950">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
