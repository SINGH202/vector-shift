import { Handle } from 'reactflow';

export function NodeHandle({ id, type, position, style, className = '' }) {
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={style}
      className={className}
    />
  );
}
