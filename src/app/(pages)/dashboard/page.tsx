"use client";
import { useState } from "react";

export default function Dashboard() {
  const [type, setType] = useState("Broken Pavement");
  const [userReport, setUserReport] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, userReport, location }),
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="dropdown" className="block mb-2">
            Select an issue:
          </label>
          <select
            id="dropdown"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded text-gray-700"
          >
            <option value="Broken Pavement">Broken Pavement</option>
            <option value="Obstructions">Obstructions</option>
            <option value="Missing Crosswalks">Missing Crosswalks</option>
            <option value="Broken Traffic Signals">
              Broken Traffic Signals
            </option>
            <option value="Insufficient Lighting">Insufficient Lighting</option>
            <option value="Vendor Encroachment">Vendor Encroachment</option>
            <option value="Flooded Sidewalks">Flooded Sidewalks</option>
            <option value="Inaccessible Design">Inaccessible Design</option>
            <option value="Speeding Threat">Speeding Threat</option>
            <option value="Reckless Driving">Reckless Driving</option>
            <option value="Congested Sidewalks">Congested Sidewalks</option>
            <option value="Excessive Noise">Excessive Noise</option>
            <option value="No Shade">No Shade</option>
            <option value="Dirty Streets">Dirty Streets</option>
            <option value="Unsafe Environment">Unsafe Environment</option>
            <option value="Missing/Confusing Signs">
              Missing/Confusing Signs
            </option>
            <option value="Illegal Parking">Illegal Parking</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <textarea
            value={userReport}
            onChange={(e) => setUserReport(e.target.value)}
            className="w-full p-2 border rounded text-gray-700"
            rows={4}
            placeholder="Enter additional details here..."
          />
        </div>
        <div>
          <label htmlFor="location" className="block mb-2">
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded text-gray-700"
            placeholder="Enter the location"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {loading ? "Loading..." : "Report"}
        </button>
      </form>
      {response && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Response:</h2>
          <p className="mt-2 p-4 bg-gray-100 rounded text-gray-700">
            {response}
          </p>
        </div>
      )}
    </div>
  );
}
