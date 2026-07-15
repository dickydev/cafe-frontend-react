import React, { useState } from "react";
import ComboBuilder from "../components/ComboBuilder";
import DynamicMenu from "../components/DynamicMenu";

export default function Menu() {
  const [combo, setCombo] = useState([]);

  const add = (item) => setCombo((current) => {
    const existing = current.find((entry) => entry.id === item.id);
    return existing
      ? current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry)
      : [...current, { ...item, quantity: 1 }];
  });

  return (
    <>
      <DynamicMenu compact onAddToCombo={add} />
      <ComboBuilder
        combo={combo}
        onAdd={add}
        onDecrease={(id) => setCombo((current) => current.flatMap((item) => item.id !== id ? [item] : item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []))}
        onRemove={(id) => setCombo((current) => current.filter((item) => item.id !== id))}
        onClear={() => setCombo([])}
      />
    </>
  );
}
