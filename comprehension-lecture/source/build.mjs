// Construit les deux applications à partir du même code :
//   dist/index.html      → application élève installable (copiée dans comprehension-lecture/)
//   dist/enseignant.html → outil enseignant avec profils (copié à la racine : comprehension_lecture.html)
import { build } from "esbuild";
import fs from "fs";

const fonts = [["Andika", "andika"], ["Atkinson Hyperlegible", "atkinson-hyperlegible"], ["Lexend", "lexend"]]
  .flatMap(([n, f]) => [400, 700].map(w => {
    const file = `node_modules/@fontsource/${f}/files/${f}-latin-${w}-normal.woff2`;
    return `@font-face{font-family:'${n}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync(file).toString("base64")}) format('woff2')}`;
  })).join("\n");

const tpl = fs.readFileSync("src/template.html", "utf8");
fs.mkdirSync("dist", { recursive: true });

for (const teacher of [false, true]) {
  const r = await build({
    entryPoints: ["src/main.jsx"], bundle: true, minify: true, write: false, format: "iife",
    target: ["chrome90", "safari15", "firefox90"], jsx: "automatic", charset: "utf8", legalComments: "none",
    define: { "process.env.NODE_ENV": '"production"', __TEACHER__: String(teacher) },
  });
  const js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
  const head = teacher ? '<link rel="icon" href="comprehension-lecture/icon-192.png">' : [
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-title" content="Comprendre">',
    '<link rel="manifest" href="manifest-comprehension.webmanifest">',
    '<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">',
    '<link rel="apple-touch-icon" href="apple-touch-icon.png">',
  ].join("\n");
  const sw = teacher ? "" : `<script>if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw-comprehension.js').catch(function () {}); }); }</script>`;
  const html = tpl
    .replace("/*TITLE*/", teacher ? "Comprendre les textes · enseignant" : "Comprendre les textes")
    .replace("<!--HEAD-->", () => head)
    .replace("/*FONTS*/", () => fonts)
    .replace("<!--SCRIPT-->", () => `<script>${js}</script>`)
    .replace("<!--SW-->", () => sw);
  const out = teacher ? "dist/enseignant.html" : "dist/index.html";
  fs.writeFileSync(out, html);
  console.log(out, (html.length / 1024).toFixed(0) + " Ko");
}
