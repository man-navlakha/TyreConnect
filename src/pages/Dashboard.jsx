export default function DashboardLanding({ username = "User", onLogout }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen p-6">
      {/* Welcome Banner */}
      <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {username} 👋</h1>
        <p className="text-gray-300">Need help with your tyre today?</p>
        <button
          onClick={onLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-xl font-semibold"
        >
          Logout
        </button>
      </section>

      {/* Quick Service Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Services</h2>
        <a href="/services">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Book Puncture Repair", emoji: "🛠️" },
            { title: "Book Tyre Replacement", emoji: "🚙" },
            { title: "Emergency Help", emoji: "🚨" },
            { title: "Wheel Alignment", emoji: "⚙️" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 p-6 rounded-2xl text-center shadow hover:scale-105 transition cursor-pointer"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
          ))}
        </div>
        </a>
      </section>

      {/* Nearby Mechanics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Nearby Mechanics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ravi Mechanic", rating: "⭐ 4.8", distance: "1.2 km" },
            { name: "Amit Tyres", rating: "⭐ 4.6", distance: "2.5 km" },
            { name: "QuickFix Garage", rating: "⭐ 4.9", distance: "3.1 km" },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-white/10 p-6 rounded-2xl shadow hover:bg-white/20 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{m.name}</h3>
              <p className="text-gray-300">{m.rating} · {m.distance} away</p>
            </div>
          ))}
        </div>
      </section>

      {/* My Bookings */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <p className="text-gray-300">No active bookings. Book a service to see it here.</p>
        </div>
      </section>

      {/* Wallet / Offers */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Wallet & Offers</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
            <p className="text-2xl font-bold">₹ 0.00</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">Available Offers</h3>
            <p className="text-gray-300">No offers right now. Stay tuned!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
