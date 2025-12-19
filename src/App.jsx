import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CafeReservation from "./components/CafeReservation";
import Navbar from "./components/Navbar";
import ViewMenu from "./components/ViewMenu";
import Menu from "./pages/Menu";
import About from "./components/About";
import Cart from "./components/Create";
import Layout from "../Layout"; 

// Temporary placeholder About & Cart pages
{/*function Cart() {
  return (
    <div className="min-h-screen flex items-center justify-center font-serif text-2xl">
      🛒 Your Cart is Empty
    </div>
  );
}*/}

export default function App() {
  return (
    <Router>
      <Layout>
      {/* Top Navbar */}
      <Navbar />
      {/* Left Floating Menu Button */}
      <ViewMenu />

      <Routes>
        {/* Homepage / Reservation */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <CafeReservation />
            </div>
          }
        />
        {/* Menu Page */}
        <Route path="/menu" element={<Menu />} />
        {/* About / Contact Page */}
        <Route path="/about" element={<About />} />
        {/* Cart Page */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
      </Layout>
    </Router>
  );
}
