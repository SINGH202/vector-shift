# Assessment Gaps — Design Spec

**Date:** 2026-06-11  
**Status:** Approved (brainstorming)  
**Scope:** Close checklist gaps for Part 3 (Text node) and Part 2 polish (styling)

**Parent spec:** `2026-06-11-vector-shift-assessment-design.md`

---

## Summary

Fix the remaining gaps vs the assessment HTML checklist: add `useUpdateNodeInternals` and variable handle labels to the Text node, then polish the UI with per-node accent colors, `lucide-react` toolbar icons, and category-grouped toolbar sections.

### Decisions

| Topic | Choice |
|---|---|
| Scope | Part 3 fixes + Part 2 polish (icons, accents, categories) |
| Icons | `lucide-react` |
| `useUpdateNodeInternals` | TextNode only |
| Handle labels | Restored in BaseNode via positioned spans |
| Metadata | Centralized in `registry.js` (`nodeCategories`) |

---

## Part 3: Text Node Fixes

### `useUpdateNodeInternals`

In `TextNode.js`, import `useUpdateNodeInternals` from `reactflow` and call it when dimensions or the variable handle list changes:

```js
const updateNodeInternals = useUpdateNodeInternals();

useEffect(() => {
  updateNodeInternals(id);
}, [id, size, variableHandles, updateNodeInternals]);
```

**Triggers:** `size` (from `useAutoResize`) and `variableHandles` (from `buildVariableHandles`).

**Why:** React Flow must recompute handle positions and edge anchor points after the node resizes or gains/loses handles.

### Variable handle labels

Update `buildVariableHandles` in `parseVariables.js` to include `label: name` on each handle.

Restore label rendering in `BaseNode.js`:

- Handles with a `label` prop show a small text label beside the connection dot
- Left-side handles (targets): label positioned to the left of the handle
- Right-side handles (sources): label positioned to the right
- Labels use `absolute` positioning aligned to the handle's `top` style
- `pointer-events-none` so labels don't block connections

Also benefits existing labeled handles on LLM, Condition, and Merge nodes.

### Unchanged

- Edge pruning when variables are removed (`pruneEdgesForNode`)
- Auto-resize via `useAutoResize`
- Regex parsing in `parseVariables.js`

---

## Part 2: UI Polish

### Dependency

```bash
npm install lucide-react
```

### Node accent colors

Add per-node accent tokens to `tailwind.config.js`:

```js
colors: {
  node: {
    emerald: '#10b981',
    amber:   '#f59e0b',
    violet:  '#8b5cf6',
    rose:    '#f43f5e',
    sky:     '#0ea5e9',
    cyan:    '#06b6d4',
    orange:  '#f97316',
    indigo:  '#6366f1',
    blue:    '#3b82f6',
  },
}
```

`createNode` config gains `accent` string. `BaseNode` applies `bg-node-{accent}` on the header bar instead of uniform `bg-vs-header`.

### Central metadata (`registry.js`)

Replace flat `toolbarNodes` with `nodeCategories`:

| Category | Nodes |
|---|---|
| **Core** | Input, Text, LLM, Output |
| **Logic** | Filter, Transform, Condition, Merge |
| **Integrations** | API Call |

Each entry includes: `type`, `label`, `icon` (Lucide component), `accent` (token key).

Export a flat `toolbarNodes` derived from categories for backward compatibility if needed.

### Toolbar layout (`toolbar.js`)

Render three labeled sections with a horizontal layout:

```
Core              Logic              Integrations
[icon Input]      [icon Filter]      [icon API Call]
[icon Text]       [icon Transform]
[icon LLM]        [icon Condition]
[icon Output]     [icon Merge]
```

Section headers: small uppercase muted text (`text-xs text-vs-muted uppercase tracking-wide`).

### Draggable chips (`draggableNode.js`)

Props: `type`, `label`, `icon`, `accent`.

- Lucide icon at 16px beside label
- Left accent border: `border-l-4 border-node-{accent}`
- Hover: `hover:ring-2 hover:ring-node-{accent}/40`

### Node definitions

Add `accent` to each `createNode({...})` call, matching registry metadata:

| Node | Accent |
|---|---|
| Input | emerald |
| Text | amber |
| LLM | violet |
| Output | rose |
| Filter | sky |
| Transform | cyan |
| Condition | orange |
| Merge | indigo |
| API Call | blue |

---

## Files to modify

| File | Changes |
|---|---|
| `package.json` | Add `lucide-react` |
| `registry.js` | `nodeCategories` with icon/accent/category |
| `tailwind.config.js` | `node.*` accent colors |
| `parseVariables.js` | Add `label` to `buildVariableHandles` |
| `BaseNode.js` | Accent header + handle label spans |
| `createNode.js` | Pass `accent` to BaseNode |
| `TextNode.js` | `useUpdateNodeInternals` effect |
| `toolbar.js` | Category sections |
| `draggableNode.js` | Icon + accent chip |
| `definitions/*.js` | `accent` on each config |

---

## Out of scope

- Icons inside canvas node headers
- Backend changes
- New node types
- `useUpdateNodeInternals` in BaseNode globally

---

## Success criteria

1. Typing in Text node resizes smoothly; handles stay aligned with edges after resize
2. `{{variable}}` patterns spawn labeled target handles on the left
3. Removing a variable removes its handle and label; edges prune correctly
4. Toolbar shows three categories with Lucide icons
5. Each node type has a distinct accent color on toolbar chip and canvas header
6. `npm run build` passes
