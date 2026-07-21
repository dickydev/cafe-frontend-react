import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QrCode, Smartphone, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QRMenuAccess() {
  const [open, setOpen] = useState(false);
  const menuUrl = useMemo(
    () =>
      typeof window === "undefined"
        ? "http://localhost:5173/menu"
        : `${window.location.origin}/menu`,
    [],
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="button-secondary-dark">
        <QrCode size={18} /> QR Menu
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/75 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              className="relative w-full max-w-md rounded-[2rem] bg-white p-6 text-center text-stone-950 shadow-2xl sm:p-8"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 rounded-full bg-stone-100 p-2 text-stone-500 hover:text-stone-950"
              >
                <X size={18} />
              </button>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-amber-300">
                <Smartphone size={25} />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                Contactless QR Menu
              </p>
              <h3 className="mt-2 text-3xl font-bold">
                Scan to open the menu.
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Pengunjung dapat membuka menu dari meja tanpa aplikasi tambahan.
              </p>
              <div className="mx-auto mt-6 w-fit rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-lg">
                <QRCodeSVG value={menuUrl} size={220} level="H" includeMargin />
              </div>
              <p className="mt-4 break-all rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-500">
                {menuUrl}
              </p>
              <button
                onClick={() => window.location.assign("/menu")}
                className="button-dark mt-5 w-full justify-center"
              >
                Open menu on this device
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
