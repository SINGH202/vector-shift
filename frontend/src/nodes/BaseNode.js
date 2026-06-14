import { Fragment } from 'react';
import { Handle, Position } from 'reactflow';
import { headerAccentClass } from './nodeAccents';

function getHandleStyle(handle, handles) {
  if (handle.top) {
    return { top: handle.top };
  }

  const sameSide = handles.filter((item) => item.position === handle.position);
  const sideIndex = sameSide.indexOf(handle);

  if (sameSide.length <= 1) {
    return { top: '50%' };
  }

  return { top: `${((sideIndex + 1) * 100) / (sameSide.length + 1)}%` };
}

function FieldInput({ field, value, onChange }) {
  const inputClassName =
    'w-full rounded-md border border-vs-border bg-vs-canvas px-2 py-1 text-sm text-slate-100 focus:border-vs-accent focus:outline-none focus:ring-1 focus:ring-vs-accent';

  if (field.type === 'select') {
    return (
      <select className={inputClassName} value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'toggle') {
    return (
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-vs-border accent-vs-accent"
        />
        <span>{value ? 'On' : 'Off'}</span>
      </label>
    );
  }

  return (
    <input
      type="text"
      className={inputClassName}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
    />
  );
}

function HandleLabel({ handle, style }) {
  if (!handle.label) {
    return null;
  }

  const isLeft = handle.position === Position.Left;

  return (
    <span
      className={`pointer-events-none absolute -translate-y-1/2 whitespace-nowrap text-[10px] font-medium text-vs-muted ${
        isLeft ? '-translate-x-2 pr-1 text-right' : 'translate-x-2 pl-1 text-left'
      }`}
      style={{
        top: style.top,
        ...(isLeft ? { right: '100%' } : { left: '100%' }),
      }}
    >
      {handle.label}
    </span>
  );
}

export function BaseNode({
  id,
  title,
  accent,
  fields = [],
  fieldValues = {},
  onFieldChange,
  handles = [],
  minWidth = 220,
  minHeight = 100,
  style = {},
  renderBody,
}) {
  const containerStyle = {
    minWidth,
    minHeight,
    width: style.width,
    height: style.height,
  };

  return (
    <div
      className="relative overflow-visible rounded-lg border border-vs-border bg-vs-surface shadow-lg"
      style={containerStyle}
    >
      <div className={`flex items-center justify-between px-3 py-1.5 ${headerAccentClass(accent)}`}>
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="max-w-[100px] truncate text-xs text-white/80">{id}</span>
      </div>

      <div className="space-y-2 p-3">
        {renderBody
          ? renderBody()
          : fields.map((field) => (
              <label key={field.key} className="block space-y-1">
                <span className="text-xs font-medium text-vs-muted">
                  {field.label}
                  {field.required ? <span className="text-red-400"> *</span> : null}
                </span>
                <FieldInput
                  field={field}
                  value={fieldValues[field.key] ?? field.default ?? ''}
                  onChange={(value) => onFieldChange(field.key, value)}
                />
              </label>
            ))}
      </div>

      {handles.map((handle) => {
        const handleStyle = getHandleStyle(handle, handles);

        return (
          <Fragment key={handle.id}>
            <Handle
              type={handle.type}
              position={handle.position}
              id={handle.id}
              style={handleStyle}
            />
            <HandleLabel handle={handle} style={handleStyle} />
          </Fragment>
        );
      })}
    </div>
  );
}
