import { DraggableNode } from './draggableNode';
import { nodeCategories } from './nodes/registry';

export const PipelineToolbar = () => {
  return (
    <div className="shrink-0 border-b border-vs-border bg-vs-surface px-4 py-3 overflow-y-auto max-h-[35vh]">
      <div className="flex flex-wrap items-end gap-6">
        {nodeCategories.map((category) => (
          <div key={category.name}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-vs-muted">
              {category.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.nodes.map((node) => (
                <DraggableNode
                  key={node.type}
                  type={node.type}
                  label={node.label}
                  icon={node.icon}
                  accent={node.accent}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
