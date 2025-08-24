// CreateRequest.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateRequest = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // Assuming auth

  // Auto-fetch location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => {
        console.error(err);
        setError("Please enable GPS/location to submit a request.");
      }
    );
  }, []);

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude || !description.trim()) {
      setError("Please wait for location and enter description.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/requests/",
        {
          latitude,
          longitude,
          description,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(true);
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to send request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          🆘 Request Roadside Help
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Info */}
          {latitude && longitude ? (
            <p className="text-sm text-green-300 text-center">
              📍 Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          ) : (
            <p className="text-sm text-yellow-300 text-center">
              ⏳ Detecting location...
            </p>
          )}

          {/* Description */}
          <textarea
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none border border-white/20 focus:ring-2 focus:ring-blue-400"
            placeholder="Describe your issue (e.g., flat tire near ISKCON Temple)..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Send Request"}
          </button>

          {/* Success / Error Messages */}
          {success && (
            <p className="text-green-400 text-sm text-center">
              ✅ Request submitted successfully!
            </p>
          )}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
