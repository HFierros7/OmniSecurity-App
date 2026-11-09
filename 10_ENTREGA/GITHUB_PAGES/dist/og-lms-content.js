import { escapeHtml } from "./og-html.js";

function renderBlocks(blocks = []) {
  return blocks.map((block) => {
    switch (block.type) {
      case "text":
        return `<div class="lesson-block"><p>${escapeHtml(block.text)}</p></div>`;
      case "image":
        return `<figure class="lesson-block lesson-media"><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || "")}"><figcaption>${escapeHtml(block.caption || "")}</figcaption></figure>`;
      case "video":
        return `<div class="lesson-block lesson-media"><video controls preload="metadata" playsinline aria-label="${escapeHtml(block.title || "Video de la lección")}"><source src="${escapeHtml(block.src)}" type="${escapeHtml(block.mimeType || "video/mp4")}">El navegador no puede reproducir este video.</video><p>${escapeHtml(block.caption || "")}</p></div>`;
      case "audio":
        return `<div class="lesson-block lesson-media"><h3>${escapeHtml(block.title || "Audio")}</h3><audio controls preload="metadata"><source src="${escapeHtml(block.src)}" type="${escapeHtml(block.mimeType || "audio/mpeg")}">El navegador no puede reproducir este audio.</audio></div>`;
      case "accordion":
        return `<details class="lesson-block lesson-accordion"><summary>${escapeHtml(block.title)}</summary><div>${renderBlocks(block.blocks || [{ type: "text", text: block.text || "" }])}</div></details>`;
      case "case":
        return `<article class="lesson-block case-card"><span class="eyebrow">Caso práctico</span><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.description)}</p></article>`;
      case "diagram":
        return `<figure class="lesson-block lesson-diagram" role="img" aria-label="${escapeHtml(block.alt || block.title)}"><figcaption>${escapeHtml(block.title)}</figcaption><pre>${escapeHtml(block.text)}</pre></figure>`;
      case "reference":
        return `<li class="lesson-reference">${escapeHtml(block.citation)}</li>`;
      default:
        return "";
    }
  }).join("");
}

export function renderLessonContent(blocks = []) {
  if (!blocks.length) {
    return `<p class="inline-notice">El contenido académico está pendiente de revisión y aprobación; esta pantalla no acredita capacitación.</p>`;
  }
  const references = blocks.filter((block) => block.type === "reference");
  const content = renderBlocks(blocks.filter((block) => block.type !== "reference"));
  return `${content}${references.length ? `<section class="lesson-references"><h3>Referencias</h3><ul>${renderBlocks(references)}</ul></section>` : ""}`;
}
