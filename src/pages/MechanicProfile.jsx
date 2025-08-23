// src/pages/MechanicProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MechanicProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch mechanic profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/mechanic/profile/", {
        headers: { Authorization: `Token ${token}` },
      });
      setProfile(res.data);
      setPosition([res.data.latitude, res.data.longitude]);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Update mechanic profile (availability & location)
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        "http://127.0.0.1:8000/api/mechanic/profile/",
        updates,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setProfile(res.data);
      setPosition([res.data.latitude, res.data.longitude]);
      setLoading(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setLoading(false);
    }
  };

  // Get browser location
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          updateProfile(newPos);
        },
        (err) => console.error("Location error:", err)
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">🔧 Mechanic Profile</h1>

      {profile ? (
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg">
          <p><strong>Availability:</strong> {profile.is_available ? "✅ Online" : "❌ Offline"}</p>
          <p><strong>Latitude:</strong> {profile.latitude}</p>
          <p><strong>Longitude:</strong> {profile.longitude}</p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => updateProfile({ is_available: !profile.is_available })}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {profile.is_available ? "Go Offline" : "Go Online"}
            </button>
            <button
              onClick={updateLocation}
              className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
              disabled={loading}
            >
              Update Location
            </button>
          </div>

          {position && (
            <div className="mt-6 h-64">
              <MapContainer
                center={position}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <Marker position={position}>
                  <Popup>You are here!</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default MechanicProfile;
