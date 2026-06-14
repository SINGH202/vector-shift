import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { useStore } from "./store";
import { ResultModal } from "./components/ResultModal";

const API_URL = "http://localhost:8000/pipelines/parse";

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      setError("Add at least one node before submitting.");
      setIsOpen(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setIsOpen(true);
    } catch (err) {
      console.error("[SubmitButton]", err);
      setError("Could not reach server. Is the backend running on port 8000?");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="flex select-none items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0f1419] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70">
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Play size={18} />
        )}
        <span>{isLoading ? "Analyzing..." : "Submit Pipeline"}</span>
      </button>
      <ResultModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        result={result}
        error={error}
      />
    </>
  );
};
