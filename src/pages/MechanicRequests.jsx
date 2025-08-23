// src/pages/MechanicRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MechanicRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/mechanic/requests/", {
        headers: { Authorization: `Token ${token}` },
      });
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">📝 My Assigned Jobs</h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : requests.length === 0 ? (
        <p>No jobs assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job list */}
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white shadow-md rounded-xl p-4 border"
              >
                <p><strong>ID:</strong> {req.id}</p>
                <p><strong>Description:</strong> {req.description}</p>
                <p><strong>Status:</strong> 
                  <span
                    className={`ml-2 px-2 py-1 rounded text-white text-sm ${
                      req.status === "Completed"
                        ? "bg-green-500"
                        : req.status === "Accepted"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
                <p><strong>Assigned:</strong> {new Date(req.created_at).toLocaleString()}</p>
                <p><strong>Location:</strong> {req.latitude}, {req.longitude}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="h-[500px]">
            <MapContainer
              center={[23.0225, 72.5714]} // Default Ahmedabad
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {requests.map((req) => (
                <Marker
                  key={req.id}
                  position={[req.latitude, req.longitude]}
                >
                  <Popup>
                    <strong>Job #{req.id}</strong><br />
                    {req.description}<br />
                    Status: {req.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicRequests;
