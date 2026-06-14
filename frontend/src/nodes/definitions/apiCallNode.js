import { Position } from 'reactflow';
import { createNode } from '../createNode';

export const ApiCallNode = createNode({
  title: 'API Call',
  accent: 'blue',
  fields: [
    { key: 'url', type: 'text', label: 'URL', default: 'https://api.example.com', required: true },
    { key: 'method', type: 'select', label: 'Method', options: ['GET', 'POST'], default: 'GET' },
  ],
  handles: [
    { type: 'target', id: 'input', position: Position.Left },
    { type: 'source', id: 'output', position: Position.Right },
  ],
});
