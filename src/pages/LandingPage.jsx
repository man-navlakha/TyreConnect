import React from 'react'

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white/5 backdrop-blur-md">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          TyreConnect 🚗<br />
          Fast & Reliable Tyre Services
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-300">
          Puncture repair, tyre replacement, and emergency roadside help – all in one place.
        </p>
        <div className="flex gap-4">
          <a
            href="/signup"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Login
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Puncture Repair", emoji: "🛠️" },
            { title: "Tyre Replacement", emoji: "🚙" },
            { title: "Wheel Alignment", emoji: "⚙️" },
            { title: "Emergency Help", emoji: "🚨" },
          ].map((service, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-4xl mb-4">{service.emoji}</div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-white/5 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: "1", text: "Book your service online in seconds." },
            { step: "2", text: "Our mechanic reaches your location." },
            { step: "3", text: "Get your tyre fixed & pay easily." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 p-8 rounded-2xl text-center hover:bg-white/20 transition"
            >
              <div className="text-4xl font-bold mb-4 text-indigo-400">{item.step}</div>
              <p className="text-lg text-gray-200">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TyreConnect?</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          {[
            { title: "24/7 Available", emoji: "⏰" },
            { title: "Trusted Mechanics", emoji: "👍" },
            { title: "Affordable", emoji: "💰" },
            { title: "Fast Service", emoji: "⚡" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 p-6 rounded-2xl shadow hover:scale-105 transition"
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <p className="font-semibold text-lg">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 px-6 bg-white/5 backdrop-blur-md text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6 text-gray-300">
          Join TyreConnect today and never worry about tyre problems again!
        </p>
        <a
          href="/signup"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
        >
          Sign Up Now
        </a>
      </footer>
    </div>
  );
}

