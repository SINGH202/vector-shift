export function ResultModal({ isOpen, onClose, result, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-vs-border bg-vs-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Pipeline Analysis</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-vs-muted transition hover:bg-vs-border hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-vs-canvas px-4 py-3">
              <span className="text-sm text-vs-muted">Nodes</span>
              <span className="text-lg font-semibold text-white">{result.num_nodes}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-vs-canvas px-4 py-3">
              <span className="text-sm text-vs-muted">Edges</span>
              <span className="text-lg font-semibold text-white">{result.num_edges}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-vs-canvas px-4 py-3">
              <span className="text-sm text-vs-muted">Valid DAG</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  result.is_dag
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {result.is_dag ? 'Yes' : 'No — cycle detected'}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-vs-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6d5ce8]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
