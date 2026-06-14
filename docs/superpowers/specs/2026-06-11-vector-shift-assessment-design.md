# VectorShift Assessment — Design Spec

**Date:** 2026-06-11  
**Status:** Approved (brainstorming)  
**Scope:** Parts 1–4 of the VectorShift frontend/backend assessment

---

## Summary

Build a polished pipeline builder on top of the existing React Flow starter by introducing a config-driven node abstraction, VectorShift-inspired Tailwind styling, enhanced Text node behavior (auto-resize + `{{variable}}` handles), and a FastAPI backend integration that validates pipeline DAG structure.

### Decisions

| Topic | Choice |
|---|---|
| Visual direction | VectorShift-inspired (dark canvas, indigo accent `#513dd9`, Inter font, blue node headers) |
| Styling tech | Tailwind CSS v3 |
| Submit feedback | Styled Tailwind modal (not native `alert`) |
| Node abstraction | Config-driven `createNode()` factory (Approach 1) |
| Demo nodes | Pipeline-themed: Filter, Transform, API Call, Condition, Merge |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  App                                                    │
│  ┌──────────────┐  ┌─────────────────────────────────┐  │
│  │ Toolbar      │  │ React Flow Canvas (ui.js)       │  │
│  │ (draggables) │  │  nodes + edges from zustand     │  │
│  └──────────────┘  └─────────────────────────────────┘  │
│  ┌──────────────┐                                       │
│  │ Submit btn   │──POST──▶ FastAPI /pipelines/parse     │
│  └──────────────┘         {num_nodes, num_edges, is_dag}│
│         │                                               │
│         ▼                                               │
│  ResultModal (Tailwind)                                 │
└─────────────────────────────────────────────────────────┘
```

### New / refactored modules

| Module | Role |
|---|---|
| `nodes/BaseNode.js` | Shared shell: header bar, body, handle rendering |
| `nodes/createNode.js` | Factory from config → React Flow component |
| `nodes/registry.js` | Maps type strings → components (used by `ui.js`) |
| `nodes/definitions/*.js` | One thin file per node type |
| `hooks/useVariableHandles.js` | Parses `{{var}}` from text, returns handle list |
| `hooks/useAutoResize.js` | Computes textarea dimensions from content |
| `components/ResultModal.js` | Submit response dialog |
| `tailwind.config.js` + `postcss.config.js` + `index.css` | Tailwind + design tokens |

### Dependencies to add (frontend)

- `tailwindcss`, `postcss`, `autoprefixer`
- `zustand` (used in `store.js` but missing from `package.json`)

### Page layout (`App.js`)

```
┌─────────────────────────────────────────────┐
│  Toolbar (top bar, horizontal scroll)       │
├─────────────────────────────────────────────┤
│  React Flow canvas (flex-1, ~80vh)          │
├─────────────────────────────────────────────┤
│  Submit bar (bottom)                        │
└─────────────────────────────────────────────┘
```

---

## Part 1: Node Abstraction

### `createNode()` config schema

```js
{
  type: 'filter',           // React Flow type key
  title: 'Filter',          // Header bar label
  accent: 'blue',           // Optional color variant for header
  minWidth: 220,
  minHeight: 100,
  fields: [                 // Declarative form fields in the body
    { key: 'condition', type: 'text', label: 'Condition', default: '' },
    { key: 'mode', type: 'select', label: 'Mode', options: ['Include', 'Exclude'] },
  ],
  handles: [                // Static handles
    { type: 'target', id: 'input', position: Position.Left },
    { type: 'source', id: 'output', position: Position.Right },
  ],
  renderBody: null,         // Optional escape hatch for custom UI (used by Text node)
}
```

### `BaseNode` responsibilities

- Render VectorShift-style header bar (light blue background, node title, truncated node id)
- Render declared `fields` with shared Tailwind-styled inputs, selects, and toggles
- Render `handles` with even vertical spacing when multiple handles share a side
- Apply `minWidth` / `minHeight`; allow dynamic sizing override via inline style (Text node)
- Manage local field state; sync to zustand via `updateNodeField` when values change

### Refactor plan

Migrate four existing nodes (`input`, `output`, `llm`, `text`) to config definitions. The Text node uses `renderBody` for auto-resizing textarea and dynamic handles.

### Five pipeline-themed demo nodes

| Node | Handles | Fields | Showcases |
|---|---|---|---|
| **Filter** | 1 target, 1 source | condition text, mode select | Basic single-in/single-out |
| **Transform** | 1 target, 1 source | operation select, preview toggle | Select + toggle field types |
| **API Call** | 1 target, 1 source | URL text, method select | Multiple text fields, required-style asterisk on URL |
| **Condition** | 1 target, 2 sources (true/false) | expression text | Multiple labeled source handles on right |
| **Merge** | 2 targets, 1 source | strategy select | Multiple labeled target handles on left |

Each new node file is ~10–20 lines of config. Toolbar gets five new `DraggableNode` entries. `registry.js` exports all types for `ui.js`.

### Field types supported

- `text` — single-line input
- `select` — dropdown with `options` array
- `toggle` — boolean checkbox/switch
- `textarea` — multi-line (used by Text node via `renderBody`)

---

## Part 2: Styling

### Tailwind setup

- Install Tailwind v3 with CRA-compatible PostCSS config
- Load **Inter** via Google Fonts in `index.html`
- Extend `tailwind.config.js`:

```js
colors: {
  vs: {
    canvas: '#0f1419',
    surface: '#1C2536',
    header: '#3b82f6',
    accent: '#513dd9',
    border: '#2d3748',
    muted: '#94a3b8',
  }
}
```

### Component styling

| Component | Treatment |
|---|---|
| Page layout | Full-viewport dark canvas; toolbar as top bar with `bg-vs-surface` and bottom border |
| Toolbar chips | Rounded-lg pills, label, `hover:ring-vs-accent`, grab cursor |
| Nodes | `rounded-lg border border-vs-border shadow-lg`; blue header strip; dark body |
| Handles | Circular `bg-vs-accent` with white ring; labeled handles show small text beside dot |
| Canvas | Dark dot grid; smooth-step edges in accent purple with arrow markers |
| Submit button | Footer bar; purple `bg-vs-accent` button with hover state |
| Result modal | Centered overlay, `bg-vs-surface` card, stat rows with green/red DAG badge |

Remove inline styles from existing components in favor of Tailwind classes. Keep React Flow's default stylesheet; add overrides in `index.css` for handle/edge theming.

---

## Part 3: Text Node Logic

### Auto-resize

Replace single-line `<input>` with `<textarea>` that grows with content:

1. Use `scrollHeight` / `scrollWidth` via ref on each change (or hidden measure element with matching font)
2. Start at `minWidth: 220`, `minHeight: 80`; cap at `maxWidth: 400`, `maxHeight: 300`
3. Recalculate in `useLayoutEffect` to avoid flicker
4. Pass computed `{ width, height }` to BaseNode shell; `resize: none` on textarea

### Variable → dynamic handles

**Parsing:** Extract unique valid JS variable names from `{{ variableName }}`:

```js
/\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g
```

- Deduplicate by name (preserve first-appearance order)
- Invalid names inside `{{ }}` are ignored
- Removing a variable removes its handle; prune orphaned edges

**Handle generation:** For each variable, create a **target** handle on the left:

```js
{ type: 'target', id: variableName, position: Left, top: `${(index + 1) * (100 / (count + 1))}%` }
```

- Evenly distributed vertically (same pattern as LLM node's two left handles)
- Handle `id` equals variable name
- Small label beside each handle showing variable name

**Source handle** on the right (`output`) unchanged.

### State flow

```
textarea onChange
  → update local text state
  → recalculate size (useLayoutEffect)
  → parse variables → derive handles array
  → sync text to zustand via updateNodeField(id, 'text', value)
  → prune orphaned edges when handles disappear
```

---

## Part 4: Backend Integration

### API contract

**Endpoint:** `POST /pipelines/parse`

**Request body (JSON):**

```json
{
  "nodes": [{ "id": "text-1", "type": "text", "position": {}, "data": {} }],
  "edges": [{ "id": "e1-2", "source": "text-1", "target": "llm-1", "sourceHandle": "output", "targetHandle": "prompt" }]
}
```

**Response:**

```json
{ "num_nodes": 3, "num_edges": 2, "is_dag": true }
```

Replace starter `GET` with `Form` field with `POST` + Pydantic model.

### Backend logic (`main.py`)

```python
class PipelinePayload(BaseModel):
    nodes: list
    edges: list

@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    is_dag = check_is_dag(payload.nodes, payload.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": is_dag}
```

**DAG check — Kahn's algorithm:**

1. Build adjacency list from edges (`source` → `target`)
2. Count in-degrees for all node ids in the graph
3. BFS from zero-in-degree nodes
4. If visited count equals total nodes in graph, it's a DAG
5. Isolated nodes (no edges) are valid with in-degree 0

**CORS:** `CORSMiddleware` allowing `http://localhost:3000`.

### Frontend (`submit.js`)

1. Read `nodes` and `edges` from zustand store
2. On click, `POST` to `http://localhost:8000/pipelines/parse` with `Content-Type: application/json`
3. Open `ResultModal` with node count, edge count, and DAG status badge
4. Loading state on button; disable double-submit

### Error handling

| Scenario | Behavior |
|---|---|
| Backend unreachable | Modal: "Could not reach server. Is the backend running?" |
| Empty pipeline | Valid: `num_nodes: 0, num_edges: 0, is_dag: true` |
| Cycle in graph | `is_dag: false`, red badge in modal |
| Network error / non-200 | Modal shows friendly error, no crash |

---

## Out of scope

- TypeScript migration (stay JavaScript)
- Automated tests (not required by assessment)
- Pipeline execution / runtime
- Authentication or persistence

---

## Success criteria

1. New nodes can be added with ~10–20 lines of config, not copy-paste
2. UI is cohesive, dark, VectorShift-inspired with Tailwind
3. Text node resizes with content and spawns handles for `{{variable}}` syntax
4. Submit sends pipeline to backend; modal shows `num_nodes`, `num_edges`, `is_dag`
5. Backend correctly identifies cycles vs valid DAGs
