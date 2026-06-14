import { borderAccentClass, ringAccentClass, textAccentClass } from './nodes/nodeAccents';

export const DraggableNode = ({ type, label, icon: Icon, accent }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`flex min-w-[100px] cursor-grab items-center gap-2 rounded-lg border border-vs-border border-l-4 bg-vs-canvas px-3 py-2 text-sm font-medium text-white transition hover:ring-2 active:cursor-grabbing ${borderAccentClass(accent)} ${ringAccentClass(accent)}`}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {Icon ? <Icon size={16} className={`shrink-0 ${textAccentClass(accent)}`} /> : null}
      <span>{label}</span>
    </div>
  );
};
