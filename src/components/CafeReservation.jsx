import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function CafeReservation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    service: 'lunch',
    notes: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, date, time, guests } = formData;
    if (name && email && phone && date && time && guests) {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        service: 'lunch',
        notes: '',
      });
    }
  };

  const inputClass =
    'w-full px-4 pt-6 pb-3 rounded-xl bg-white/25 border border-white/30 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-60 text-gray-900 peer backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-102 focus:scale-105 focus:shadow-lg';

  const labelClass =
    'absolute left-4 top-3 text-gray-600 text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-sm peer-focus:text-gray-800';

  return (
    <div
      className="min-h-screen flex flex-col font-serif text-gray-900"
      style={{
        backgroundImage: 'url("/background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="text-center py-12 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-4 drop-shadow-lg tracking-wide"
        >
          ☕ Cafe Lab Experience
        </motion.h1>
        <p className="max-w-xl mx-auto text-lg text-gray-700">
          Book your table online easily and enjoy a warm coffeehouse experience.
        </p>
      </header>

      <main className="flex justify-center px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-white/30"
        >
          <img
            src="/hotcoco.webp"
            alt="Hot Cocoa Sticker"
            className="absolute top-34 right-5 w-[190px] h-[190px] opacity-80 z-0 animate-bounce-slow"
          />
          <img
            src="/pizza.webp"
            alt="Pizza Sticker"
            className="absolute bottom-8 left-2 w-[180px] h-[180px] opacity-80 z-0 animate-bounce-slow"
          />
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Reserve Your Table
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'name', type: 'text', label: 'Full Name' },
              { name: 'email', type: 'email', label: 'Email' },
              { name: 'phone', type: 'tel', label: 'Phone' },
              { name: 'guests', type: 'number', label: 'Number of Guests' },
            ].map((field) => (
              <div className="relative" key={field.name}>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder=" "
                  className={inputClass}
                  required
                />
                <label className={labelClass}>{field.label}</label>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder=" "
                  className={inputClass}
                  required
                  pattern="\d{4}-\d{2}-\d{2}"
                  min={new Date().toISOString().split('T')[0]}
                />
                <label className={labelClass}>Date</label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder=" "
                  className={inputClass}
                  required
                />
                <label className={labelClass}>Time</label>
              </div>
            </div>

            <div className="relative">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-60 text-gray-900 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-102 focus:scale-105 focus:shadow-lg"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="relative">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder=" "
                className={inputClass + ' resize-none'}
              />
              <label className={labelClass}>Special Requests</label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gray-800 hover:bg-brown-700 hover:scale-105 hover:shadow-lg transition transform text-lg font-medium text-white"
            >
              Book Now
            </button>
          </form>
        </motion.div>
      </main>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/20 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                className="flex justify-center mb-4"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Reservation Confirmed!
              </h3>
              <p className="text-gray-800 mb-6">
                We look forward to serving you ☕
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 hover:shadow-lg text-white font-medium transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center py-6 text-black-900 text-sm">
        © 2025 Made by Annisa Rizka Herawaty. All rights reserved.
      </footer>
    </div>
  );
}
