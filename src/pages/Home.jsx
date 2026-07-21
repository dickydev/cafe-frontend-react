import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AboutSection from "../components/AboutSection";
import AITavernMaster from "../components/ai/AITavernMaster";
import ComboBuilder from "../components/ComboBuilder";
import ContactSection from "../components/ContactSection";
import DynamicMenu from "../components/DynamicMenu";
import ExperiencePlanner from "../components/ExperiencePlanner";
import HeroSection from "../components/HeroSection";
import InteractiveReservation from "../components/InteractiveReservation";

export default function Home() {
  return <CafeReservation />;
}
