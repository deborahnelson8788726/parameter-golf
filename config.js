/*
 * Agentic OS — единый источник данных дашборда.
 *
 * Это «визуальный слой» поверх вашей памяти и коннекторов. Дашборд читает
 * данные ОТСЮДА. Чтобы обновить то, что видно на экране, правьте этот файл —
 * или подключите живые данные через MCP (см. поля `source` у виджетов и
 * README.md). По задумке агентной ОС данные подтягиваются при каждом открытии.
 */
window.AOS_CONFIG = {
  owner: "Dmitrii Vasilev · Trinity",

  // ── Слой 1–5: архитектура системы ──────────────────────────────────────
  layers: [
    { id: "model",      name: "Модель",            icon: "◆", status: "active",
      detail: "Claude Opus 4.8 / Sonnet — интеллект системы",        note: "brain → Слои/Модель" },
    { id: "memory",     name: "Память",            icon: "▤", status: "active",
      detail: "Obsidian-мозг + Postgres (Railway)",                  note: "brain → Слои/Память" },
    { id: "rules",      name: "Правила и скиллы",   icon: "§", status: "active",
      detail: "CLAUDE.md, Skills — кто вы и как работать",            note: "brain → Слои/Правила-и-скиллы" },
    { id: "connectors", name: "Коннекторы",        icon: "⇄", status: "partial",
      detail: "Доступ к сервисам через MCP",                         note: "brain → Слои/Коннекторы" },
    { id: "visual",     name: "Визуальный слой",   icon: "▦", status: "active",
      detail: "Этот дашборд — командный центр",                      note: "brain → Слои/Визуальный-слой" },
  ],

  // ── Коннекторы (вкл/выкл переключаются на дашборде, состояние хранится) ──
  connectors: [
    { id: "obsidian", name: "Obsidian",      icon: "🧠", connected: true  },
    { id: "github",   name: "GitHub",        icon: "🐙", connected: true  },
    { id: "mcp",      name: "MCP (trinity-rag)", icon: "⚙", connected: true  },
    { id: "drive",    name: "Google Drive",  icon: "📁", connected: false },
    { id: "calendar", name: "Календарь",     icon: "📅", connected: false },
    { id: "mail",     name: "Почта",         icon: "✉",  connected: false },
    { id: "notion",   name: "Notion",        icon: "📝", connected: false },
    { id: "sheets",   name: "Таблицы",       icon: "▦",  connected: false },
  ],

  // ── Модули и сервисы экосистемы Trinity (управляемые блоки) ─────────────
  modules: [
    { id: "rag",     name: "trios-mcp-rag",   kind: "MCP-сервер", status: "running",
      repo: "https://github.com/gHashTag/trios-mcp-rag", desc: "RAG over Postgres, 5 агент-инструментов" },
    { id: "site",    name: "Trinity Site",    kind: "Лендинг",    status: "running",
      repo: "trinity/",            desc: "Продающий сайт MCP-услуг + захват лидов" },
    { id: "browser", name: "BrowserOS",       kind: "Агент",      status: "running",
      repo: "https://github.com/gHashTag/BrowserOS", desc: "Агентный браузер" },
    { id: "edge",    name: "trinity (edge)",  kind: "Инференс",   status: "idle",
      repo: "https://github.com/gHashTag/trinity", desc: "Ternary/BitNet LLM на железе за $30" },
    { id: "chip",    name: "tt-trinity-gf16", kind: "Кремний",    status: "shipped",
      repo: "https://github.com/gHashTag/tt-trinity-gf16", desc: "Dot-product ускоритель на TinyTapeout" },
    { id: "railway", name: "trios-railway",   kind: "Инфра",      status: "running",
      repo: "https://github.com/gHashTag/trios-railway", desc: "Сервисы IGLA + Postgres на Railway" },
  ],

  // ── Виджеты (только просмотр; данные подтягиваются при открытии) ─────────
  widgets: {
    aiNews: {
      title: "Что нового в AI",
      source: "MCP: news/feed → подставьте живой источник",
      items: [
        { h: "MCP стал стандартом интеграций", s: "Claude/Cursor/Windsurf нативно поддерживают серверы" },
        { h: "Дешёвый инференс на edge", s: "BitNet/ternary — LLM без GPU, ваша тема trinity" },
        { h: "Open-silicon волна", s: "TinyTapeout-потоки удешевляют тейп-аут" },
        { h: "Агентные браузеры", s: "Рост спроса на агентов, оперирующих веб" },
        { h: "Спрос на MCP-разработку", s: "Команды ищут безопасный доступ агентов к данным" },
      ],
    },
    today: {
      title: "Сегодня",
      source: "MCP: calendar + tasks",
      items: [
        { h: "Задеплоить лендинг на Cloudflare Pages", s: "приоритет · 30 мин",  tag: "high" },
        { h: "5 холодных писем по сигналу (Cursor-вакансии)", s: "продажи", tag: "high" },
        { h: "Перевести MCP-сервер на HTTP для Railway", s: "инфра", tag: "mid" },
        { h: "Записать 3-мин демо-видео воронки", s: "контент", tag: "mid" },
      ],
    },
    metrics: {
      title: "Мои метрики",
      source: "MCP: sheets/analytics",
      items: [
        { label: "Цель/мес чистыми", value: "$10 000" },
        { label: "Лиды (нед.)",       value: "0" },
        { label: "Активные сделки",   value: "0" },
        { label: "Публичных репо",    value: "181" },
      ],
    },
    inbox: {
      title: "Входящее",
      source: "MCP: mail + github + mess(только счётчики и темы)",
      items: [
        { h: "GitHub: PR в parameter-golf", s: "ветка niche-website", count: 1 },
        { h: "Почта не подключена", s: "подключите коннектор «Почта»", count: 0 },
        { h: "Заявки с лендинга", s: "появятся после деплоя формы", count: 0 },
      ],
    },
  },
};
