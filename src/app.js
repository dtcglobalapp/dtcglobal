// src/app.js
import { mountShell } from "../core/ui-shell.js";
import { createRouter } from "../core/router.js";

const root = document.getElementById("app-root");

if (!root) {
  document.body.innerHTML = `
    <div style="padding:20px;font-family:system-ui;color:white;background:#0b0d11">
      ❌ No encuentro <b>#app-root</b> en app.html.
      Revisa que exista: <code>&lt;div id="app-root"&gt;&lt;/div&gt;</code>
    </div>
  `;
  throw new Error("Missing #app-root");
}

mountShell(root, { onNavigate: (hash) => (location.hash = hash) });

const router = createRouter(root);
router.start();

console.log("✅ DTC Core boot OK");