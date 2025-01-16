"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function TestRAG() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test RAG API</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded text-gray-700"
            rows={4}
            placeholder="Enter your query here..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      {response && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Response:</h2>
          <div className="mt-2 p-4 bg-gray-100 rounded text-gray-700">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
