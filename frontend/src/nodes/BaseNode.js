import { Fragment } from "react";
import { Position } from "reactflow";
import { X } from "lucide-react";
import { headerAccentClass } from "./nodeAccents";
import { NodeHandle } from "../components/NodeHandle";
import { useStore } from "../store";

function getHandleStyle(handle, handles) {
  if (handle.top) {
    return { top: handle.top };
  }

  const sameSide = handles.filter((item) => item.position === handle.position);
  const sideIndex = sameSide.indexOf(handle);

  if (sameSide.length <= 1) {
    return { top: "50%" };
  }

  return { top: `${((sideIndex + 1) * 100) / (sameSide.length + 1)}%` };
}

function FieldInput({ field, value, onChange }) {
  const inputClassName =
    "nodrag nopan nowheel w-full rounded-md border border-vs-border bg-vs-canvas px-2 py-1 text-sm text-slate-100 focus:border-vs-accent focus:outline-none focus:ring-1 focus:ring-vs-accent";

  if (field.type === "select") {
    return (
      <select
        className={inputClassName}
        value={value}
        onChange={(e) => onChange(e.target.value)}>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "toggle") {
    return (
      <label className="nodrag nopan nowheel flex cursor-pointer items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-vs-border accent-vs-accent"
        />
        <span>{value ? "On" : "Off"}</span>
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
        isLeft
          ? "-translate-x-2 pr-1 text-right"
          : "translate-x-2 pl-1 text-left"
      }`}
      style={{
        top: style.top,
        ...(isLeft ? { right: "100%" } : { left: "100%" }),
      }}>
      {handle.label}
    </span>
  );
}

export function BaseNode({
  id,
  title,
  accent,
  icon,
  selected = false,
  fields = [],
  fieldValues = {},
  onFieldChange,
  handles = [],
  minWidth = 220,
  minHeight = 100,
  style = {},
  renderBody,
}) {
  const deleteNode = useStore((state) => state.deleteNode);

  const containerStyle = {
    minWidth,
    width: style.width,
    minHeight: style.minHeight ?? minHeight,
  };

  return (
    <div
      data-node-root
      className={`group/node relative overflow-visible rounded-lg border bg-vs-surface shadow-lg transition-colors ${
        selected
          ? "border-vs-accent ring-2 ring-vs-accent/30"
          : "border-vs-border"
      }`}
      style={containerStyle}>
      <div
        className={`flex items-center justify-between px-3 py-1.5 ${headerAccentClass(accent)}`}>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          {icon ? <span className="opacity-90">{icon}</span> : null}
          <span>{title}</span>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            deleteNode(id);
          }}
          className="nodrag nopan rounded p-1 text-white/70 opacity-0 transition-all hover:bg-white/10 hover:text-red-300 focus:opacity-100 group-hover/node:opacity-100"
          title="Delete node"
          aria-label="Delete node">
          <X size={14} />
        </button>
      </div>

      <div className="relative space-y-2 overflow-visible p-3">
        {renderBody
          ? renderBody()
          : fields.map((field) => (
              <label key={field.key} className="nodrag nopan nowheel block space-y-1">
                <span className="text-xs font-medium text-vs-muted">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-400"> *</span>
                  ) : null}
                </span>
                <FieldInput
                  field={field}
                  value={fieldValues[field.key] ?? field.default ?? ""}
                  onChange={(value) => onFieldChange?.(field.key, value)}
                />
              </label>
            ))}
      </div>

      {handles.map((handle) => {
        const handleStyle = getHandleStyle(handle, handles);

        return (
          <Fragment key={handle.id}>
            <NodeHandle
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
