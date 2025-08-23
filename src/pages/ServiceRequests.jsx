// ServiceRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_URL = "http://127.0.0.1:8000/api/requests/";

// Fix default marker icon (Leaflet + React issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom mechanic icon (red pin)
const mechanicIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch user requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Token ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create new request
  const createRequest = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      alert("Location not available yet.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        API_URL,
        { latitude, longitude, description },
        { headers: { Authorization: `Token ${token}` } }
      );
      setDescription("");
      fetchRequests();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.detail || "Error creating request");
    } finally {
      setLoading(false);
    }
  };

  // Cancel request
  const cancelRequest = async (id) => {
    try {
      await axios.patch(
        `${API_URL}${id}/`,
        { status: "Cancelled" },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete request
  const deleteRequest = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-detect location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => {
        console.error(err);
        alert("Location access denied. Please enable GPS.");
      }
    );
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🚗 Service Requests</h2>

      {/* New Request Form */}
      <form
        onSubmit={createRequest}
        className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow mb-6"
      >
        <h3 className="text-lg font-semibold mb-2">New Service Request</h3>

        {/* Auto Location + Map */}
        {latitude && longitude ? (
          <div className="mb-3">
            <p className="text-sm text-gray-300">
              📍 Location detected: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              style={{ height: "250px", width: "100%", borderRadius: "10px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* User Location */}
              <Marker position={[latitude, longitude]}>
                <Popup>🧑 You are here</Popup>
              </Marker>

              {/* Show mechanic pin if any request has mechanic assigned */}
              {requests.map(
                (req) =>
                  req.mechanic_lat &&
                  req.mechanic_lng && (
                    <Marker
                      key={req.id}
                      position={[req.mechanic_lat, req.mechanic_lng]}
                      icon={mechanicIcon}
                    >
                      <Popup>
                        🔧 Mechanic: {req.mechanic?.username || "Assigned"}
                      </Popup>
                    </Marker>
                  )
              )}
            </MapContainer>
          </div>
        ) : (
          <p className="text-red-400 mb-3">Detecting location...</p>
        )}

        <textarea
          placeholder="Describe your issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded w-full mb-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Requests List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">My Requests</h3>
        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((req) => (
              <li
                key={req.id}
                className="p-4 bg-white/10 backdrop-blur-lg rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{req.description}</p>
                  <p className="text-sm text-gray-400">
                    Status: {req.status} | Mechanic:{" "}
                    {req.mechanic?.username || "Pending"}
                  </p>
                </div>
                <div className="space-x-2">
                  {req.status !== "Cancelled" && (
                    <button
                      onClick={() => cancelRequest(req.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => deleteRequest(req.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServiceRequests;
