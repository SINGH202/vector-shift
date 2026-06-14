import { Position } from 'reactflow';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;

export function parseVariables(text) {
  if (!text) return [];

  const seen = new Set();
  const variables = [];

  for (const match of text.matchAll(VARIABLE_REGEX)) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      variables.push(name);
    }
  }

  return variables;
}

export function buildVariableHandles(text) {
  const variables = parseVariables(text);

  return variables.map((name, index) => ({
    type: 'target',
    id: name,
    position: Position.Left,
    label: name,
    top: `${((index + 1) * 100) / (variables.length + 1)}%`,
  }));
}
