import type { APIRoute } from "astro";
import sharp from "sharp";

/**
 * Картинка по умолчанию для превью ссылок — у записей без своей обложки.
 *
 * Рисуется только фигурами, без единой текстовой ноды: sharp растрирует SVG
 * системным рендерером, и любой <text> зависел бы от шрифтов, установленных
 * на машине сборки. У локального Mac и ubuntu-раннера они разные, так что
 * картинка получалась бы неодинаковой. Геометрия воспроизводится всегда.
 */
const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffb020"/>
      <stop offset="55%" stop-color="#f472b6"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <radialGradient id="glowA" cx="18%" cy="8%" r="55%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="88%" cy="14%" r="50%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="72%" cy="96%" r="55%">
      <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#14b8a6" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#07080c"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowA)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowB)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowC)"/>

  <!-- сетка-чертёж, как на главной -->
  <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
    ${Array.from({ length: 18 }, (_, i) => `<line x1="${i * 72}" y1="0" x2="${i * 72}" y2="${HEIGHT}"/>`).join("")}
    ${Array.from({ length: 10 }, (_, i) => `<line x1="0" y1="${i * 72}" x2="${WIDTH}" y2="${i * 72}"/>`).join("")}
  </g>

  <!-- знак >_ : шеврон и подчёркивание нарисованы контурами -->
  <rect x="470" y="185" width="260" height="260" rx="58" fill="url(#mark)"/>
  <path d="M 545 258 L 606 315 L 545 372" fill="none" stroke="#12100a"
        stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="622" y="356" width="82" height="24" rx="12" fill="#12100a"/>

  <!-- акцентная линия внизу -->
  <rect x="0" y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="url(#mark)"/>
</svg>`;

export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  // Buffer как тело ответа работает, но в BodyInit его нет — отдаём чистый
  // ArrayBuffer. Копия здесь не важна: код выполняется один раз при сборке.
  const body = png.buffer.slice(
    png.byteOffset,
    png.byteOffset + png.byteLength,
  ) as ArrayBuffer;
  return new Response(body, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};
