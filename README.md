# VectorShift Pipeline Builder

A visual pipeline builder for composing workflow nodes on a canvas, inspired by [VectorShift](https://vectorshift.ai/). Built as a technical assessment submission.

Drag nodes from the toolbar, connect them with edges, configure fields per node, and submit the pipeline to a FastAPI backend for structural validation (node count, edge count, and DAG check).

## What This Project Does

- **Build pipelines visually** — React Flow canvas with drag-and-drop nodes and smooth-step connections
- **Configure node inputs** — Each node type exposes relevant fields (text, selects, toggles)
- **Validate structure** — Submit sends the graph to the backend; a modal reports whether the pipeline is a valid directed acyclic graph (DAG)

This is a **builder + validator**, not a runtime. Pipelines are not executed (no LLM calls, API calls, or file processing).

## Assessment Solutions

### Part 1 — Node Abstraction

**Problem:** Four starter nodes duplicated layout, handles, and wrapper code. Adding new nodes meant copy-paste and heavy edits.

**Solution:**

- `BaseNode` — shared shell (header, fields, handles, labels)
- `createNode()` — config-driven factory; new nodes are ~10–20 lines of declarative config
- Migrated **Input**, **Output**, **LLM**, and **Text** to the abstraction
- Added **5 demo nodes**: Filter, Transform, API Call, Condition, Merge
- Central `registry.js` maps types for React Flow and the toolbar

### Part 2 — Styling

**Problem:** Starter UI had minimal styling and no cohesive design.

**Solution:**

- **Tailwind CSS** with VectorShift-inspired tokens (dark canvas `#0f1419`, accent `#513dd9`, Inter font)
- Styled toolbar (categories, icons, accent chips), nodes (per-type header colors), handles, edges, canvas controls
- **`lucide-react`** icons; toolbar grouped into **Core**, **Logic**, and **Integrations**
- Submit action aligned with toolbar chip styling under **Actions**

### Part 3 — Text Node Logic

**Problem:** Text node was fixed size with a single-line input; no support for `{{variable}}` template handles.

**Solution:**

- **Auto-resize** textarea via `useAutoResize` — node grows with content (capped width/height)
- **`{{variableName}}` parsing** — valid JS identifiers spawn dynamic **target** handles on the left
- **`useUpdateNodeInternals`** — React Flow recomputes handle positions when size or variables change
- Orphaned edges pruned when variables are removed

### Part 4 — Backend Integration

**Problem:** Submit button was inert; backend only returned a stub response.

**Solution:**

- Frontend **POST** `{ nodes, edges }` to `/pipelines/parse`
- FastAPI returns `{ num_nodes, num_edges, is_dag }`
- **Kahn's algorithm** for DAG detection (topological sort via in-degree)
- **CORS** enabled for `http://localhost:3000`
- **Result modal** shows counts and DAG status (green/red badge)

## Tech Stack

| Layer    | Stack                                                        |
| -------- | ------------------------------------------------------------ |
| Frontend | React 18, React Flow 11, Zustand, Tailwind CSS, lucide-react |
| Backend  | FastAPI, Pydantic, Uvicorn                                   |
| Tooling  | Create React App, PostCSS                                    |

## Project Structure

```
vector-shift/
├── frontend/          # React pipeline builder UI
│   └── src/
│       ├── nodes/     # BaseNode, createNode, definitions, registry
│       ├── hooks/     # useAutoResize
│       ├── components/  # ResultModal
│       └── ...
├── backend/           # FastAPI DAG validation API
│   └── main.py
└── docs/superpowers/specs/  # Design specs
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+

### Frontend

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload
```

API runs at [http://localhost:8000](http://localhost:8000).

- Health: `GET /` → `{ "Ping": "Pong" }`
- Parse: `POST /pipelines/parse` with JSON body `{ "nodes": [...], "edges": [...] }`

### Try It

1. Start both frontend and backend
2. Drag nodes onto the canvas and connect them
3. In a **Text** node, type `Hello {{name}}` — a left handle appears for `name`
4. Click **Submit** in the toolbar **Actions** section
5. Review the modal: node count, edge count, and whether the graph is a DAG

## Node Types

| Category     | Nodes                               |
| ------------ | ----------------------------------- |
| Core         | Input, Text, LLM, Output            |
| Logic        | Filter, Transform, Condition, Merge |
| Integrations | API Call                            |

## Deployment Notes

- **Frontend** deploys cleanly to Vercel (set root directory to `frontend`)
- **Backend** (FastAPI + Uvicorn) is suited to Railway, Render, or Fly.io — Vercel serverless would require adapting the API
- For production, set `REACT_APP_API_URL` on the frontend and add the deployed origin to backend CORS

## License

Assessment submission — see repository owner for usage terms.
