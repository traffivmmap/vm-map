const NS = 'http://www.w3.org/2000/svg';

export function createOutlinedSVGText({
text = 'Centered Stroke',
fontSize = '12pt', // use pt units directly
fill = '#111827',
strokeColor = '#111827',
strokeWidth = 1,
x = 0,
y = 20,
fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial'
} = {}) {
const svg = document.createElementNS(NS, 'svg');
// Let SVG size itself based on text
svg.setAttribute('width', '100%');
svg.setAttribute('height', '100%');


const t = document.createElementNS(NS, 'text');
t.setAttribute('text-anchor', 'start');        // left align (default)
t.setAttribute('dominant-baseline', 'hanging'); // top align
t.setAttribute('x', String(x));
t.setAttribute('y', String(y));
t.setAttribute('font-size', fontSize);
t.setAttribute('font-family', fontFamily);
t.setAttribute('fill', fill);
t.setAttribute('stroke', strokeColor);
t.setAttribute('stroke-width', String(strokeWidth));
t.setAttribute('paint-order', 'stroke fill');
t.textContent = text;
svg.append(t);


return svg;
}