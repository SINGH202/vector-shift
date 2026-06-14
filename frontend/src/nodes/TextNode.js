import { useEffect, useMemo, useRef, useState } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useAutoResize } from '../hooks/useAutoResize';
import { buildVariableHandles } from '../utils/parseVariables';
import { useStore } from '../store';

export function TextNode({ id, data }) {
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const updateNodeField = useStore((state) => state.updateNodeField);
  const pruneEdgesForNode = useStore((state) => state.pruneEdgesForNode);
  const [text, setText] = useState(data?.text ?? '{{input}}');

  const size = useAutoResize(textareaRef, text);
  const variableHandles = useMemo(() => buildVariableHandles(text), [text]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, size, variableHandles, updateNodeInternals]);

  useEffect(() => {
    pruneEdgesForNode(id, new Set(variableHandles.map((handle) => handle.id)));
  }, [id, variableHandles, pruneEdgesForNode]);

  const handles = [
    ...variableHandles,
    { type: 'source', id: 'output', position: Position.Right, label: 'output' },
  ];

  const handleTextChange = (event) => {
    const nextText = event.target.value;
    setText(nextText);
    updateNodeField(id, 'text', nextText);
  };

  return (
    <BaseNode
      id={id}
      title="Text"
      accent="amber"
      handles={handles}
      minWidth={220}
      minHeight={80}
      style={size}
      renderBody={() => (
        <label className="block space-y-1">
          <span className="text-xs font-medium text-vs-muted">Text</span>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            className="w-full resize-none rounded-md border border-vs-border bg-vs-canvas px-2 py-1 text-sm text-slate-100 focus:border-vs-accent focus:outline-none focus:ring-1 focus:ring-vs-accent"
            rows={3}
          />
        </label>
      )}
    />
  );
}
