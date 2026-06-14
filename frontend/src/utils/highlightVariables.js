const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;

export function getHighlightedParts(text) {
  if (!text) {
    return [];
  }

  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(VARIABLE_REGEX)) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'variable', value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
}
