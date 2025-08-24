import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";

const MechanicDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ Fetch job requests
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

  // ✅ Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/requests/${id}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update job status");
    }
  };

  // ✅ Send location via WebSocket
  const sendLocation = (lat, lng) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ lat, lng }));
    }
  };

  useEffect(() => {
    fetchRequests();

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/location/?token=${token}`);
    setSocket(ws);

    let watchId = null;
    ws.onopen = () => {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMechanicLocation({ lat: latitude, lng: longitude });
            sendLocation(latitude, longitude);
          },
          (error) => console.error("Error getting location:", error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
      }
    };

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  const center = mechanicLocation || { lat: 23.0225, lng: 72.5714 };
  const [availability, setAvailability] = useState(null);



  // ✅ Fetch availability status
  const fetchAvailability = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/mechanic/availability/", {
        headers: { Authorization: `Token ${token}` },
      });
      setAvailability(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setLoading(false);
    }
  };

  // ✅ Toggle availability (PATCH)
  const toggleAvailability = async () => {
    try {
      const res = await axios.patch(
        "http://127.0.0.1:8000/api/mechanic/profile/",
        { is_available: !availability.is_available },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAvailability((prev) => ({ ...prev, is_available: res.data.is_available }));
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      alert("Failed to update availability");
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Fullscreen Google Map */}
      <LoadScript googleMapsApiKey="AIzaSyAdA5hHuUEiTOARAcVEmMWrnBGfCAi7c7c">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={13}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {requests.map((req) => (
            <Marker
              key={req.id}
              position={{ lat: req.latitude, lng: req.longitude }}
              onClick={() => setSelectedMarker(req)}
            />
          ))}

          {mechanicLocation && (
            <Marker
              position={mechanicLocation}
              icon={{
                url: "https://cdn-icons-png.flaticon.com/512/15915/15915159.png",
                scaledSize: new window.google.maps.Size(45, 45),
              }}
            />
          )}

          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.latitude,
                lng: selectedMarker.longitude,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <strong>Job #{selectedMarker.id}</strong>
                <br />
                {selectedMarker.description}
                <br />
                Status: {selectedMarker.status}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* --- Overlay UI --- */}

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-80 border-b border-gray-200">
        <nav className="max-w-[1920px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          <div className="flex items-center space-x-2">
            <i className="fas fa-truck-moving text-blue-600 text-lg"></i>
            <span className="font-semibold text-gray-900 text-sm select-none">
              TyreConnect
            </span>
          </div>
          <ul className="hidden md:flex space-x-8 text-xs text-gray-700">
            <li className="cursor-pointer">Home</li>
          </ul>
          <div className="flex items-center space-x-4 text-xs text-gray-700">
            <span>John Customer (customer)</span>
            <button className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-cog"></i>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <div className="absolute top-16 left-4 z-10 w-80">
      







    <aside className="absolute top-10 left-4 z-10 w-80 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-4 flex flex-col space-y-4 overflow-y-auto max-h-[85vh]">
      {/* Profile & Availability */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {availability?.username || "Mechanic"}
          </h2>
          <p className="text-xs text-gray-600">Mechanic</p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${
              availability?.is_available ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className="text-xs font-medium">
            {availability?.is_available ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* ✅ Toggle Button */}
      <button
        onClick={toggleAvailability}
        className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 flex items-center justify-center space-x-2 ${
          availability?.is_available
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        <i className="fas fa-power-off"></i>
        <span>{availability?.is_available ? "Go Offline" : "Go Online"}</span>
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-100 rounded-lg p-3 text-blue-700 text-xs font-semibold shadow-sm">
          <div className="flex items-center space-x-1 mb-1">
            <i className="fas fa-dollar-sign"></i>
            <span>Today</span>
          </div>
          <div className="text-md font-bold">₹850</div>
        </div>
        <div className="bg-green-100 rounded-lg p-3 text-green-700 text-xs font-semibold shadow-sm">
          <div className="flex items-center space-x-1 mb-1">
            <i className="fas fa-briefcase"></i>
            <span>Jobs</span>
          </div>
          <div className="text-md font-bold">12</div>
        </div>
      </div>

      {/* Weekly Earnings */}
      <div className="bg-purple-50 rounded-lg p-3 text-purple-700 text-xs font-semibold shadow-sm">
        <div className="mb-1">This Week</div>
        <div className="text-md font-bold">₹4200</div>
        <div className="text-[10px] font-normal text-purple-400 mt-0.5">
          +15% from last week
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-gray-200 rounded-lg p-3 text-xs text-gray-700 overflow-y-auto overflow-hidden max-h-[320px]">
        <div className="font-semibold mb-2 py-3 px-6 -m-3  sticky -top-3 bg-blue-500 text-white  w-screen ">Recent Jobs</div>
        {requests.map((req) => (
          <div key={req.id} className="mb-3 border-b pb-2 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">Job #{req.id}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  req.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : req.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : req.status === "Accepted"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {req.status}
              </span>
            </div>
            <p className="text-[11px] text-gray-600">{req.description}</p>
            <p className="text-[10px] text-gray-400">
              {new Date(req.created_at).toLocaleString()}
            </p>

            {/* Status update dropdown */}
            <div className="mt-2">
              <select
                value={req.status}
                onChange={(e) => handleStatusChange(req.id, e.target.value)}
                className="border rounded px-2 py-1 text-xs w-full"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      {/* <div className="border border-yellow-300 rounded-lg p-3 text-yellow-800 text-xs bg-yellow-50 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <i className="fas fa-lightbulb"></i>
          <span className="font-semibold">Tips</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px]">
          <li>Stay online during peak hours</li>
          <li>Keep tools & spare parts ready</li>
          <li>Maintain good ratings</li>
          <li>Update location regularly</li>
        </ul>
      </div> */}

    </aside>




























      </div>
    </div>
  );
};

export default MechanicDashboard;
