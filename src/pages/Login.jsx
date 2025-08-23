import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api-token-auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.token);
        navigate("/");
      } else {
        const data = await response.json();
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Something went wrong!");
      console.log(err)
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
