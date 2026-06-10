/*
 * Agentic OS dashboard — рендер визуального слоя из config.js.
 *
 * Логика намеренно простая: «сначала обзор, потом действия» (как в гайде).
 * Управляемые элементы — только переключатели коннекторов и поле «Фокус дня».
 * Их состояние хранится в localStorage, чтобы сохранялось между открытиями.
 */
(function () {
  "use strict";
  const C = window.AOS_CONFIG || {};
  const LS = {
    focus: "aos.focus",
    conn: "aos.connectors", // map id -> bool override
  };

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ── Дата + владелец ─────────────────────────────────────────────────────
  function renderHeader() {
    const d = new Date();
    $("date").textContent = d.toLocaleDateString("ru-RU", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    $("owner").textContent = C.owner || "";

    const focus = $("focus");
    focus.value = localStorage.getItem(LS.focus) || "";
    focus.addEventListener("input", () => localStorage.setItem(LS.focus, focus.value));
  }

  // ── Слои ────────────────────────────────────────────────────────────────
  function renderLayers() {
    const wrap = $("layers");
    (C.layers || []).forEach((l) => {
      const card = el("div", "layer");
      card.innerHTML =
        `<span class="layer__status"><span class="dot dot--${esc(l.status)}"></span></span>` +
        `<div class="layer__icon">${esc(l.icon || "◆")}</div>` +
        `<div class="layer__name">${esc(l.name)}</div>` +
        `<div class="layer__detail">${esc(l.detail || "")}</div>`;
      card.title = l.note || "";
      wrap.appendChild(card);
    });
  }

  // ── Коннекторы (переключаемые, состояние сохраняется) ───────────────────
  function loadConnState() {
    try { return JSON.parse(localStorage.getItem(LS.conn) || "{}"); } catch { return {}; }
  }
  function renderConnectors() {
    const wrap = $("connectors");
    const override = loadConnState();
    let on = 0;
    (C.connectors || []).forEach((cn) => {
      const isOn = cn.id in override ? override[cn.id] : !!cn.connected;
      if (isOn) on++;
      const node = el("div", "conn" + (isOn ? " is-on" : ""));
      node.innerHTML =
        `<span class="conn__ico">${esc(cn.icon || "•")}</span>` +
        `<span class="conn__name">${esc(cn.name)}</span>` +
        `<span class="conn__sw"></span>`;
      node.addEventListener("click", () => {
        const cur = loadConnState();
        const now = !(cn.id in cur ? cur[cn.id] : !!cn.connected);
        cur[cn.id] = now;
        localStorage.setItem(LS.conn, JSON.stringify(cur));
        node.classList.toggle("is-on", now);
        updateConnHint();
      });
      wrap.appendChild(node);
    });
    updateConnHint();
  }
  function updateConnHint() {
    const override = loadConnState();
    const total = (C.connectors || []).length;
    let on = 0;
    (C.connectors || []).forEach((cn) => {
      const isOn = cn.id in override ? override[cn.id] : !!cn.connected;
      if (isOn) on++;
    });
    $("connHint").textContent = `подключено ${on} из ${total} · клик переключает`;
  }

  // ── Модули и сервисы ────────────────────────────────────────────────────
  function renderModules() {
    const wrap = $("modules");
    (C.modules || []).forEach((m) => {
      const name = m.repo
        ? `<a href="${esc(m.repo)}" target="_blank" rel="noopener">${esc(m.name)}</a>`
        : esc(m.name);
      const card = el("div", "mod");
      card.innerHTML =
        `<div class="mod__top"><span class="mod__name">${name}</span>` +
        `<span class="pill pill--${esc(m.status)}">${esc(m.status)}</span></div>` +
        `<span class="mod__kind">${esc(m.kind || "")}</span>` +
        `<div class="mod__desc">${esc(m.desc || "")}</div>`;
      wrap.appendChild(card);
    });
  }

  // ── Виджеты ─────────────────────────────────────────────────────────────
  function head(w) {
    return `<div class="widget__title">${esc(w.title)}</div>` +
           `<div class="widget__src">⇄ ${esc(w.source || "")}</div>`;
  }
  function renderToday() {
    const w = C.widgets?.today; if (!w) return;
    const items = w.items.map((i) =>
      `<li><span class="tag tag--${esc(i.tag || "mid")}"></span>` +
      `<span><span class="h">${esc(i.h)}</span><br><span class="s">${esc(i.s || "")}</span></span></li>`).join("");
    $("w-today").innerHTML = head(w) + `<ul class="wlist">${items}</ul>`;
  }
  function renderMetrics() {
    const w = C.widgets?.metrics; if (!w) return;
    const cells = w.items.map((m) =>
      `<div class="metric"><div class="metric__v">${esc(m.value)}</div><div class="metric__l">${esc(m.label)}</div></div>`).join("");
    $("w-metrics").innerHTML = head(w) + `<div class="metrics-grid">${cells}</div>`;
  }
  function renderInbox() {
    const w = C.widgets?.inbox; if (!w) return;
    const items = w.items.map((i) =>
      `<li><span class="bullet">▸</span><span><span class="h">${esc(i.h)}</span><br>` +
      `<span class="s">${esc(i.s || "")}</span></span><span class="count">${esc(i.count ?? 0)}</span></li>`).join("");
    $("w-inbox").innerHTML = head(w) + `<ul class="wlist">${items}</ul>`;
  }
  function renderAiNews() {
    const w = C.widgets?.aiNews; if (!w) return;
    const items = w.items.map((i) =>
      `<li><span class="bullet">▸</span><span><span class="h">${esc(i.h)}</span><br>` +
      `<span class="s">${esc(i.s || "")}</span></span></li>`).join("");
    $("w-ainews").innerHTML = head(w) + `<ul class="wlist">${items}</ul>`;
  }

  function renderSync() {
    const t = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    $("sync").textContent = `данные подтянуты в ${t}`;
  }

  // ── Запуск (данные подтягиваются при каждом открытии) ───────────────────
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderLayers();
    renderConnectors();
    renderModules();
    renderToday();
    renderMetrics();
    renderInbox();
    renderAiNews();
    renderSync();
  });
})();
