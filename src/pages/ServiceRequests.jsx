import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  LoadScript,
} from "@react-google-maps/api";

const API_URL = "http://127.0.0.1:8000/api/requests/";
const GOOGLE_MAPS_API_KEY = "AIzaSyAdA5hHuUEiTOARAcVEmMWrnBGfCAi7c7c"; // Replace this with your real key

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "1rem",
};

const defaultCenter = { lat: 23.0225, lng: 72.5714 };

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const token = localStorage.getItem("token");

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

  const createRequest = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a location.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        API_URL,
        {
          latitude: location.lat,
          longitude: location.lng,
          description,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      setDescription("");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data || "Error creating request");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

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

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("GPS not enabled. You can manually select location on map.");
      }
    );

    fetchRequests();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass p-6 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-4">🚗 Service Request</h2>

          <form onSubmit={createRequest} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">📍 Select or Confirm Location:</label>

              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={location || defaultCenter}
                  zoom={15}
                  onClick={(e) =>
                    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                  }
                  onLoad={() => setMapLoaded(true)}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              </LoadScript>

              {location && (
                <p className="text-sm mt-2 text-green-300">
                  Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </div>

            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your vehicle issue..."
              className="w-full p-3 rounded bg-white/10 backdrop-blur text-white border border-white/20 focus:outline-none"
              rows={3}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-xl font-semibold"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        <div className="glass p-6 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">📋 My Requests</h3>
          {requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <ul className="space-y-4">
              {requests.map((req) => (
                <li
                  key={req.id}
                  className="bg-white/5 p-4 rounded-xl flex justify-between items-center backdrop-blur"
                >
                  <div>
                    <p className="font-semibold">{req.description}</p>
                    <p className="text-sm text-gray-300">
                      Status: <span className={`font-bold ${req.status === "Completed"
                        ? "text-green-400"
                        : req.status === "Cancelled"
                          ? "text-red-400"
                          : "text-yellow-400"
                        }`}>
                        {req.status}
                      </span>{" "}
                      | Mechanic: {req.mechanic?.username || "Pending"}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${req.latitude},${req.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline text-blue-400"
                    >
                      View on Map
                    </a>
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
    </div>
  );
};

export default ServiceRequests;
