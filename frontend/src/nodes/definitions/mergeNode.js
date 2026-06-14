import { Position } from 'reactflow';
import { createNode } from '../createNode';

export const MergeNode = createNode({
  title: 'Merge',
  accent: 'indigo',
  fields: [
    {
      key: 'strategy',
      type: 'select',
      label: 'Strategy',
      options: ['Concat', 'Join'],
      default: 'Concat',
    },
  ],
  handles: [
    { type: 'target', id: 'inputA', position: Position.Left, label: 'A', top: '33%' },
    { type: 'target', id: 'inputB', position: Position.Left, label: 'B', top: '66%' },
    { type: 'source', id: 'output', position: Position.Right },
  ],
});
