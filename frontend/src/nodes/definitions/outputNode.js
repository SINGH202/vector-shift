import { Position } from 'reactflow';
import { LogOut } from 'lucide-react';
import { createNode } from '../createNode';

export const OutputNode = createNode({
  title: 'Output',
  accent: 'rose',
  icon: <LogOut size={16} />,
  getFieldDefaults: ({ id }) => ({
    outputName: id.replace('customOutput-', 'output_'),
  }),
  fields: [
    {
      key: 'outputName',
      type: 'text',
      label: 'Name',
      default: '',
    },
    {
      key: 'outputType',
      type: 'select',
      label: 'Type',
      options: ['Text', 'Image'],
      default: 'Text',
    },
  ],
  handles: [{ type: 'target', id: 'value', position: Position.Left }],
});
