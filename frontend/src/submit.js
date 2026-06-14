import { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from './store';
import { ResultModal } from './components/ResultModal';

const API_URL = 'http://localhost:8000/pipelines/parse';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setIsOpen(true);
    } catch {
      setError('Could not reach server. Is the backend running on port 8000?');
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
        className="flex min-w-[100px] cursor-pointer items-center gap-2 rounded-lg border border-vs-border border-l-4 border-l-vs-accent bg-vs-canvas px-3 py-2 text-sm font-medium text-white transition hover:ring-2 hover:ring-vs-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} className="shrink-0 text-vs-accent" />
        <span>{isLoading ? 'Analyzing...' : 'Submit'}</span>
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
