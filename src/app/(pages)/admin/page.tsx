"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  interface Input {
    _id: string;
    type: string;
    userReport: string;
    location: string;
    createdAt: string;
  }

  const [inputs, setInputs] = useState<Input[]>([]);

  useEffect(() => {
    const fetchInputs = async () => {
      const res = await fetch("/api/inputs");
      const data = await res.json();
      setInputs(data);
    };

    fetchInputs();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Issue Type</th>
            <th className="border border-gray-300 p-2">User Report</th>
            <th className="border border-gray-300 p-2">Location</th>
            <th className="border border-gray-300 p-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input) => (
            <tr key={input._id}>
              <td className="border border-gray-300 p-2">{input.type}</td>
              <td className="border border-gray-300 p-2">{input.userReport}</td>
              <td className="border border-gray-300 p-2">{input.location}</td>
              <td className="border border-gray-300 p-2">
                {new Date(input.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
