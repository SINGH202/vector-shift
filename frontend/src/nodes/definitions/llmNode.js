import { Position } from 'reactflow';
import { Brain } from 'lucide-react';
import { createNode } from '../createNode';

export const LLMNode = createNode({
  title: 'LLM',
  accent: 'violet',
  icon: <Brain size={16} />,
  minHeight: 120,
  fields: [],
  renderBody: () => <span className="text-sm text-vs-muted">This is a LLM.</span>,
  handles: [
    { type: 'target', id: 'system', position: Position.Left, label: 'system', top: '33%' },
    { type: 'target', id: 'prompt', position: Position.Left, label: 'prompt', top: '66%' },
    { type: 'source', id: 'response', position: Position.Right, label: 'response' },
  ],
});
