import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", form, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Registration success:", response.data);
      navigate("/login");
    } catch (err) {
      if (err.response) {
        // Server responded with error
        console.error("❌ Error response:", err.response.data);
        setError(JSON.stringify(err.response.data));
      } else if (err.request) {
        // No response received (likely CORS or server down)
        console.error("⚠️ No response:", err.request);
        setError("Cannot reach server. Check if backend is running.");
      } else {
        console.error("🚨 Error:", err.message);
        setError("Unexpected error: " + err.message);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-xl font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
