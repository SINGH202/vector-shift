import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-vs-canvas">
      <PipelineToolbar />
      <main className="min-h-0 flex-1">
        <PipelineUI />
      </main>
    </div>
  );
}

export default App;
