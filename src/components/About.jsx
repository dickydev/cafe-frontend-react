import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function About() {
  const [openSections, setOpenSections] = useState({
    hours: true,
    address: false,
    contact: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className="min-h-screen px-6 py-16 font-serif text-gray-900"
      style={{
        backgroundImage: 'url("/background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1 className="text-5xl font-bold text-center mb-14 drop-shadow-lg">
        About Us
      </h1>

      <section className="mb-16 bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          ☕ Our Story
        </h2>
        <p className="text-lg text-gray-800 leading-relaxed">
          The coziest place in Jakarta to eat and chill. Now available on
          TravelokaEats, Google Maps, and Zomato.<br></br>
          Guilt free thin crust pizzas, healthy bowls, sandwiches & treats
          served in a charming outpost with swings, airy decor, and a peaceful
          ambiance that makes every visit feel like a little escape. <br></br>
          Our cafe is crafted to bring comfort, flavor, and joy in every bite.
        </p>
      </section>

      <section className="mb-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <img
          src="/cafe1.jpg"
          alt="Cafe Interior 1"
          className="rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <img
          src="/cafe2.jpg"
          alt="Cafe Interior 2"
          className="rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <img
          src="/cafe3.jpg"
          alt="Cafe Interior 3"
          className="rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
        />
      </section>

      <section className="max-w-4xl mx-auto bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 space-y-6">
        {['hours', 'address', 'contact'].map((sectionKey) => {
          const sectionTitles = {
            hours: 'OPEN HOURS',
            address: 'ADDRESS',
            contact: 'CONTACT',
          };
          return (
            <div key={sectionKey}>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(sectionKey)}
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {sectionTitles[sectionKey]}
                </h3>

                <motion.span
                  className="text-2xl font-bold"
                  animate={{ rotate: openSections[sectionKey] ? 0 : 90 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {openSections[sectionKey] ? '−' : '+'}
                </motion.span>
              </div>

              <AnimatePresence initial={false}>
                {openSections[sectionKey] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-2 text-gray-800"
                  >
                    {sectionKey === 'hours' && (
                      <p>Monday to Sunday : 10:00am - 10:00pm</p>
                    )}
                    {sectionKey === 'address' && (
                      <p>
                        <a
                          href="https://www.google.com/maps/dir//Shop+no.2,+Char+khamba,+Post+Office+Rd,+nr.+Graphic+Era,+Clement+Town,+Dehradun,+Bharu+Wala+Grant,+Uttarakhand+248002/@30.2700201,77.9140993,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x39092bad95934057:0x6f812e2cf19883e6!2m2!1d77.9965006!2d30.2700459?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gray-600"
                        >
                          Jl. Pluit Raya No. 29, Penjaringan,
                          <br />
                          Jakarta Utara, DKI Jakarta 14560
                        </a>
                      </p>
                    )}
                    {sectionKey === 'contact' && (
                      <div>
                        <p>Phone: +62857 9228 2059</p>
                        <p>Mail: cafelabjkt@gmail.com</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="mt-4 flex justify-center">
          <motion.a
            href="https://www.google.com/maps/dir//Shop+no.2,+Char+khamba,+Post+Office+Rd,+nr.+Graphic+Era,+Clement+Town,+Dehradun,+Bharu+Wala+Grant,+Uttarakhand+248002/@30.2700201,77.9140993,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x39092bad95934057:0x6f812e2cf19883e6!2m2!1d77.9965006!2d30.2700459?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            VISIT
          </motion.a>
        </div>
      </section>
      <div className="mt-4 flex justify-center">
        <a
          href="https://www.instagram.com/cafelab_jkt"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg hover:scale-110 transition-transform"
        >
          IG
        </a>
      </div>
    </div>
  );
}
