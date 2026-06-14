export function headerAccentClass(accent) {
  return accent ? `bg-node-${accent}` : 'bg-vs-header';
}

export function borderAccentClass(accent) {
  return accent ? `border-node-${accent}` : 'border-vs-border';
}

export function ringAccentClass(accent) {
  return accent ? `hover:ring-node-${accent}/40` : 'hover:ring-vs-accent/40';
}

export function textAccentClass(accent) {
  return accent ? `text-node-${accent}` : 'text-white';
}
