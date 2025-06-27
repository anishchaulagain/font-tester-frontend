export function doesFontSupportText(text: string, font: string): boolean {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return true;

  ctx.font = `16px ${font}, monospace`;

  const baselineWidth = ctx.measureText(text).width;
  ctx.font = `16px monospace`;
  const fallbackWidth = ctx.measureText(text).width;

  return baselineWidth !== fallbackWidth;
}


export function getUnsupportedCharacterSet(text: string, font: string): Set<string> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.fontSize = '64px';
  container.style.whiteSpace = 'nowrap';
  document.body.appendChild(container);

  const unsupported = new Set<string>();

  for (const char of text) {
    const test = document.createElement('span');
    test.textContent = char;

    const fallback = document.createElement('span');
    fallback.textContent = char;

    test.style.fontFamily = `'${font}', monospace`;
    fallback.style.fontFamily = `monospace`;

    container.innerHTML = '';
    container.appendChild(test);
    const width1 = test.offsetWidth;

    container.innerHTML = '';
    container.appendChild(fallback);
    const width2 = fallback.offsetWidth;

    if (width1 === width2) {
      unsupported.add(char);
    }
  }

  document.body.removeChild(container);
  return unsupported;
}
