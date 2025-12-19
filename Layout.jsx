import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#f2f2f2] text-gray-900">
      {/* Container for consistent spacing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}
