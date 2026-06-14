import { Position } from 'reactflow';
import { createNode } from '../createNode';

export const FilterNode = createNode({
  title: 'Filter',
  accent: 'sky',
  fields: [
    { key: 'condition', type: 'text', label: 'Condition', default: '' },
    { key: 'mode', type: 'select', label: 'Mode', options: ['Include', 'Exclude'], default: 'Include' },
  ],
  handles: [
    { type: 'target', id: 'input', position: Position.Left },
    { type: 'source', id: 'output', position: Position.Right },
  ],
});
