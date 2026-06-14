import { Position } from 'reactflow';
import { createNode } from '../createNode';

export const InputNode = createNode({
  title: 'Input',
  accent: 'emerald',
  getFieldDefaults: ({ id }) => ({
    inputName: id.replace('customInput-', 'input_'),
  }),
  fields: [
    {
      key: 'inputName',
      type: 'text',
      label: 'Name',
      default: '',
    },
    {
      key: 'inputType',
      type: 'select',
      label: 'Type',
      options: ['Text', 'File'],
      default: 'Text',
    },
  ],
  handles: [{ type: 'source', id: 'value', position: Position.Right }],
});
