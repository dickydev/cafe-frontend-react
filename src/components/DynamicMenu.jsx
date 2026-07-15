import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, SlidersHorizontal, Star } from "lucide-react";
import { menuCategories, menuItems } from "../data/cafeData";
import { formatRupiah } from "../utils/formatRupiah";
import SectionHeading from "./ui/SectionHeading";

export default function DynamicMenu({ onAddToCombo, compact = false }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [dietary, setDietary] = useState("all");
  const [sort, setSort] = useState("featured");
  const [addedId, setAddedId] = useState(null);

  const filteredMenu = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = menuItems.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesDietary = dietary === "all" || item.dietary.includes(dietary);
      const searchable = `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
      return matchesCategory && matchesDietary && searchable.includes(normalizedSearch);
    });

    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return Number(b.tags.includes("best seller")) - Number(a.tags.includes("best seller"));
    });
  }, [category, dietary, search, sort]);

  const addItem = (item) => {
    onAddToCombo?.(item);
    setAddedId(item.id);
    window.setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <section id="menu" className={compact ? "section-space pt-32" : "section-space bg-stone-50"}>
      <div className="page-shell">
        <SectionHeading
          eyebrow="Dynamic menu"
          title="Find your next cafe favorite."
          description="Search, filter, and sort the menu in real time. Add anything you like directly into your custom combo."
        />

        <div className="mt-9 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
              {menuCategories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    category === item.id
                      ? "bg-stone-950 text-white shadow-lg shadow-stone-950/10"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[610px]">
              <label className="relative sm:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search menu..."
                  className="form-control pl-10"
                />
              </label>
              <label className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <select value={dietary} onChange={(event) => setDietary(event.target.value)} className="form-control pl-10">
                  <option value="all">All preferences</option>
                  <option value="halal">Halal</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </label>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="form-control">
                <option value="featured">Featured</option>
                <option value="rating">Highest rated</option>
                <option value="price-low">Lowest price</option>
                <option value="price-high">Highest price</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            Showing <span className="font-semibold text-stone-900">{filteredMenu.length}</span> items
          </p>
          <p className="hidden text-sm text-stone-500 sm:block">All prices include tax</p>
        </div>

        <motion.div layout className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.28 }}
                className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-stone-900/10"
              >
                <div className="relative h-52 overflow-hidden bg-amber-50">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain p-7 transition duration-500 group-hover:scale-110" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold capitalize text-stone-700 shadow-sm backdrop-blur">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-stone-950 px-3 py-1.5 text-xs font-bold text-white">
                    <Star size={13} className="fill-amber-300 text-amber-300" /> {item.rating}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-700">{item.category}</p>
                      <h3 className="mt-1 text-xl font-bold text-stone-950">{item.name}</h3>
                    </div>
                    <p className="whitespace-nowrap text-base font-bold text-stone-950">{formatRupiah(item.price)}</p>
                  </div>
                  <p className="mt-3 min-h-[52px] text-sm leading-6 text-stone-600">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                      {item.dietary.map((label) => (
                        <span key={label} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold capitalize text-emerald-700">
                          {label}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => addItem(item)} className="button-small">
                      {addedId === item.id ? <><Check size={15} /> Added</> : "+ Add to combo"}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMenu.length === 0 && (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-stone-900">No menu item matches your filters.</p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); setDietary("all"); }}
              className="mt-3 text-sm font-bold text-amber-700 hover:text-amber-800"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
