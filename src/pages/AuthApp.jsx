import { useState } from "react";

export default function AuthApp() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isLogin ? "http://127.0.0.1:8000/api-token-auth/" : "http://127.0.0.1:8000/api/register/";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid credentials or registration failed");

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        {!token ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold transition disabled:opacity-50"
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-gray-300 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                className="text-pink-400 ml-2 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </>
        ) : (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Welcome 🎉</h2>
            <p className="mb-6">You are logged in with token:</p>
            <p className="text-xs break-all mb-6 bg-black/30 p-2 rounded-lg">
              {token}
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
