import { SubmitButton } from '../submit';

export function AppHeader() {
  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-purple-900/20">
          VS
        </div>
        <h1 className="text-xl font-bold text-slate-100">
          VectorShift{' '}
          <span className="font-normal text-indigo-400">Pipelines</span>
        </h1>
      </div>
      <SubmitButton />
    </header>
  );
}
