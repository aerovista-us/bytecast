(() => {
  const STYLE_ID = "bc-handoff-footer-style-v1";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .bc-handoff {
        margin-top: 16px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.12);
        background: linear-gradient(140deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
        padding: 14px;
        box-shadow: 0 12px 34px rgba(0,0,0,0.35);
      }
      .bc-handoff__top {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap: 12px;
        flex-wrap:wrap;
      }
      .bc-handoff__title {
        margin: 0;
        font: 900 14px/1.2 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.72);
      }
      .bc-handoff__subtitle {
        margin: 6px 0 0;
        color: rgba(255,255,255,0.66);
        font-size: 13px;
        max-width: 90ch;
      }
      .bc-handoff__grid { display:grid; gap: 10px; margin-top: 12px; }
      .bc-handoff__row { display:flex; gap: 10px; flex-wrap:wrap; align-items:center; }
      .bc-chip {
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.03);
        color: rgba(255,255,255,0.84);
        padding: 4px 10px;
        font: 800 11px/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      .bc-links { display:flex; gap: 10px; flex-wrap:wrap; }
      .bc-link {
        text-decoration:none;
        border-radius: 999px;
        border: 1px solid rgba(34,167,255,0.35);
        background: rgba(34,167,255,0.12);
        color: rgba(255,255,255,0.92);
        padding: 10px 12px;
        font: 700 13px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      .bc-link:hover { box-shadow: 0 0 18px rgba(34,167,255,0.20); border-color: rgba(34,167,255,0.55); }
      .bc-link--quiet {
        border-color: rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.02);
      }
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalizeRelatedNext(profile) {
    const raw = profile?.related_next || profile?.handoff?.related_next || null;
    if (Array.isArray(raw)) return raw;
    return [];
  }

  function normalizeThreadTags(profile) {
    const raw = profile?.thread_tags || profile?.threads?.tags || null;
    if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
    return [];
  }

  function normalizeHandoff(profile) {
    const handoff = profile?.handoff && typeof profile.handoff === "object" ? profile.handoff : null;
    if (!handoff) return null;
    const href = String(handoff.href || "").trim();
    if (!href) return null;
    return {
      label: String(handoff.label || "Open handoff"),
      href,
      return_label: String(handoff.return_label || "Back to ByteCast"),
      return_href: String(handoff.return_href || "../../episodes/training_hub/index.html"),
    };
  }

  function render({ profile, container }) {
    if (!container) return;
    if (!profile || typeof profile !== "object") return;

    const tags = normalizeThreadTags(profile);
    const related = normalizeRelatedNext(profile);
    const handoff = normalizeHandoff(profile);

    if (!tags.length && !related.length && !handoff) {
      container.innerHTML = "";
      return;
    }

    ensureStyle();

    const title = profile?.episode?.code ? `${profile.episode.code} handoff` : "Handoff";
    const subtitle = "Use this to keep the conversation connected across ByteCast lanes and other apps.";

    const tagHtml = tags.length
      ? `<div class="bc-handoff__row">${tags.map((t) => `<span class="bc-chip">${escapeHtml(t)}</span>`).join("")}</div>`
      : "";

    const relatedHtml = related.length
      ? `<div class="bc-links">${related
          .map((r) => {
            const href = String(r?.href || "").trim();
            if (!href) return "";
            const label = String(r?.label || "Open");
            return `<a class="bc-link bc-link--quiet" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
          })
          .filter(Boolean)
          .join("")}</div>`
      : "";

    const handoffHtml = handoff
      ? `<div class="bc-links">
          <a class="bc-link" href="${escapeHtml(handoff.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(handoff.label)}</a>
          <a class="bc-link bc-link--quiet" href="${escapeHtml(handoff.return_href)}">${escapeHtml(handoff.return_label)}</a>
        </div>`
      : "";

    container.innerHTML = `
      <section class="bc-handoff" aria-label="Handoff and thread links">
        <div class="bc-handoff__top">
          <div>
            <p class="bc-handoff__title">${escapeHtml(title)}</p>
            <p class="bc-handoff__subtitle">${escapeHtml(subtitle)}</p>
          </div>
        </div>
        <div class="bc-handoff__grid">
          ${tagHtml}
          ${handoffHtml}
          ${relatedHtml}
        </div>
      </section>
    `;
  }

  window.ByteCastHandoffFooter = { render };
})();

