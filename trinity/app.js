/*
 * Lead form handling.
 *
 * Set CONFIG.endpoint to your form backend (Formspree, Basin, a Cloudflare
 * Worker, Supabase function, etc.). If left empty, the form gracefully falls
 * back to opening the visitor's mail client with the message pre-filled, so
 * the page is useful the moment you deploy it.
 */
const CONFIG = {
  endpoint: "", // e.g. "https://formspree.io/f/xxxxxxx"
  fallbackEmail: "hello@trinity.dev", // <-- replace with your real inbox
};

const form = document.getElementById("leadForm");
const note = document.getElementById("formNote");

function setNote(msg, kind) {
  note.textContent = msg;
  note.classList.remove("is-error", "is-ok");
  if (kind) note.classList.add(kind);
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.name || !data.email || !data.usecase) {
    setNote("Please fill in your name, email and what you need.", "is-error");
    return;
  }
  if (!validEmail(data.email)) {
    setNote("That email doesn't look right — mind checking it?", "is-error");
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Sending…";

  try {
    if (CONFIG.endpoint) {
      const res = await fetch(CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status " + res.status);
      form.reset();
      setNote("Got it — I'll reply within one business day. Thank you!", "is-ok");
    } else {
      // Graceful fallback: open the visitor's mail client.
      const subject = encodeURIComponent("AI-Agent Readiness Audit request");
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "-"}\n\nUse-case:\n${data.usecase}`
      );
      window.location.href = `mailto:${CONFIG.fallbackEmail}?subject=${subject}&body=${body}`;
      setNote("Opening your email app… if nothing happens, write me directly.", "is-ok");
    }
  } catch (err) {
    setNote("Something went wrong sending that. Please email me directly instead.", "is-error");
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
});

// Small touch: reflect current year nowhere needed, but keep nav active state subtle.
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    /* smooth scroll handled by CSS scroll-behavior */
  });
});
