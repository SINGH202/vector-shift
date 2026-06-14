import { Position } from 'reactflow';
import { createNode } from '../createNode';

export const ConditionNode = createNode({
  title: 'Condition',
  accent: 'orange',
  fields: [{ key: 'expression', type: 'text', label: 'Expression', default: '' }],
  handles: [
    { type: 'target', id: 'input', position: Position.Left },
    { type: 'source', id: 'true', position: Position.Right, label: 'true', top: '33%' },
    { type: 'source', id: 'false', position: Position.Right, label: 'false', top: '66%' },
  ],
});
