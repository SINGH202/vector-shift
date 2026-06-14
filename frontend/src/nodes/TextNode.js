import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Position, useUpdateNodeInternals } from "reactflow";
import { FileText } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { useAutoResize } from "../hooks/useAutoResize";
import { parseVariables } from "../utils/parseVariables";
import { getHighlightedParts } from "../utils/highlightVariables";
import { useStore } from "../store";

const DEFAULT_TEXT = "{{input}}";
const VARIABLE_ROW_HEIGHT = 36;
const TEXT_NODE_CHROME = 180;

function getHandleTopPercent(nodeRect, targetRect) {
  const centerY = targetRect.top + targetRect.height / 2;
  return `${((centerY - nodeRect.top) / nodeRect.height) * 100}%`;
}

export function TextNode({ id, data, selected }) {
  const textareaRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const variableRowRefs = useRef({});
  const isMounted = useRef(false);
  const updateNodeInternals = useUpdateNodeInternals();
  const updateNodeField = useStore((state) => state.updateNodeField);
  const pruneEdgesForNode = useStore((state) => state.pruneEdgesForNode);
  const storedText = useStore((state) => {
    const node = state.nodes.find((n) => n.id === id);
    return node?.data?.text ?? data?.text;
  });
  const text = typeof storedText === "string" ? storedText : DEFAULT_TEXT;
  const variables = useMemo(() => parseVariables(text), [text]);
  const [handleTops, setHandleTops] = useState({});

  const size = useAutoResize(textareaRef, text, {
    chromeOffset: TEXT_NODE_CHROME + variables.length * VARIABLE_ROW_HEIGHT,
    minHeight: 60,
    minWidth: 250,
    maxWidth: 420,
  });

  const syncHandlePositions = useCallback(() => {
    const nodeEl = contentRef.current?.closest("[data-node-root]");
    if (!nodeEl) {
      return;
    }

    const nodeRect = nodeEl.getBoundingClientRect();
    const nextTops = {};

    variables.forEach((name) => {
      const row = variableRowRefs.current[name];
      if (row) {
        nextTops[name] = getHandleTopPercent(nodeRect, row.getBoundingClientRect());
      }
    });

    nextTops.output = "50%";
    setHandleTops(nextTops);
  }, [variables]);

  useLayoutEffect(() => {
    syncHandlePositions();
    updateNodeInternals(id);
  }, [id, size, variables, text, syncHandlePositions, updateNodeInternals]);

  useEffect(() => {
    const node = useStore.getState().nodes.find((n) => n.id === id);
    const currentText = node?.data?.text;
    if (typeof currentText !== "string") {
      updateNodeField(id, "text", DEFAULT_TEXT);
    }
  }, [id, updateNodeField]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    pruneEdgesForNode(id, new Set([...variables, "output"]));
  }, [id, variables, pruneEdgesForNode]);

  const handleTextChange = (event) => {
    updateNodeField(id, "text", event.target.value);
  };

  const handleScroll = useCallback((event) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = event.target.scrollTop;
    }
  }, []);

  const highlightedParts = getHighlightedParts(text);

  const handles = useMemo(
    () => [
      ...variables.map((name) => ({
        type: "target",
        id: name,
        position: Position.Left,
        label: name,
        top: handleTops[name] ?? "50%",
      })),
      {
        type: "source",
        id: "output",
        position: Position.Right,
        label: "output",
        top: handleTops.output ?? "50%",
      },
    ],
    [variables, handleTops],
  );

  return (
    <BaseNode
      id={id}
      title="Text"
      accent="amber"
      icon={<FileText size={16} />}
      selected={selected}
      handles={handles}
      minWidth={250}
      minHeight={200}
      style={size}
      renderBody={() => (
        <div
          ref={contentRef}
          className="nodrag nopan nowheel flex flex-col gap-2 transition-all duration-200">
          <span className="text-xs font-medium text-vs-muted">Text Content</span>

          <div className="relative min-h-[60px] max-h-[300px] w-full overflow-hidden rounded-md border border-vs-border bg-vs-canvas focus-within:border-vs-accent focus-within:ring-1 focus-within:ring-vs-accent">
            <div
              ref={overlayRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-3 font-mono text-sm leading-relaxed text-slate-100">
              {highlightedParts.map((part, index) =>
                part.type === "variable" ? (
                  <span
                    key={`${part.value}-${index}`}
                    className="rounded bg-vs-accent/20 px-0.5 text-vs-accent">
                    {part.value}
                  </span>
                ) : (
                  <span key={`${part.value}-${index}`}>{part.value}</span>
                ),
              )}
              {text.endsWith("\n") ? <br /> : null}
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onScroll={handleScroll}
              spellCheck={false}
              style={{ height: size.textareaHeight, color: "transparent" }}
              placeholder="Type {{variable}} to add dynamic inputs..."
              className="nodrag nopan nowheel relative z-10 block w-full resize-none overflow-y-auto bg-transparent p-3 font-mono text-sm leading-relaxed caret-slate-100 focus:outline-none"
            />
          </div>

          {variables.length > 0 ? (
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 border-t border-vs-border pt-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-vs-muted">
                  Detected Variables
                </span>
                <span className="rounded-full bg-vs-accent/20 px-1.5 py-0.5 font-mono text-[10px] text-vs-accent">
                  {variables.length}
                </span>
              </div>
              {variables.map((name) => (
                <div
                  key={name}
                  ref={(element) => {
                    if (element) {
                      variableRowRefs.current[name] = element;
                    } else {
                      delete variableRowRefs.current[name];
                    }
                  }}
                  className="flex h-9 items-center rounded-md border border-vs-border bg-vs-canvas px-3 pl-4">
                  <span className="truncate font-mono text-xs font-medium text-slate-200">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    />
  );
}
