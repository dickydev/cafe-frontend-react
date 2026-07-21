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
  const location = useLocation();
  const [combo, setCombo] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    if (!location.hash) return;
    const timer = window.setTimeout(() => {
      document
        .querySelector(location.hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  const addToCombo = (item) => {
    setCombo((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const decreaseComboItem = (id) => {
    setCombo((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item];
        if (item.quantity <= 1) return [];
        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const toggleActivity = (activity) => {
    setSelectedActivities((current) =>
      current.some((item) => item.id === activity.id)
        ? current.filter((item) => item.id !== activity.id)
        : [...current, activity],
    );
  };

  return (
    <>
      <HeroSection
        onReserve={() =>
          document
            .getElementById("reservation")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <AITavernMaster
        combo={combo}
        selectedActivities={selectedActivities}
        onAddToCombo={addToCombo}
      />
      <DynamicMenu onAddToCombo={addToCombo} />
      <ComboBuilder
        combo={combo}
        onAdd={addToCombo}
        onDecrease={decreaseComboItem}
        onRemove={(id) =>
          setCombo((current) => current.filter((item) => item.id !== id))
        }
        onClear={() => setCombo([])}
      />
      <ExperiencePlanner
        selectedActivities={selectedActivities}
        onToggle={toggleActivity}
      />
      <InteractiveReservation
        combo={combo}
        selectedActivities={selectedActivities}
      />
      <AboutSection />
      <ContactSection />
    </>
  );
}
