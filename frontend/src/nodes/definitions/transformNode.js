import { Position } from 'reactflow';
import { createNode } from '../createNode';

export const TransformNode = createNode({
  title: 'Transform',
  accent: 'cyan',
  fields: [
    {
      key: 'operation',
      type: 'select',
      label: 'Operation',
      options: ['Uppercase', 'Lowercase', 'Trim'],
      default: 'Uppercase',
    },
    { key: 'preview', type: 'toggle', label: 'Preview', default: false },
  ],
  handles: [
    { type: 'target', id: 'input', position: Position.Left },
    { type: 'source', id: 'output', position: Position.Right },
  ],
});
