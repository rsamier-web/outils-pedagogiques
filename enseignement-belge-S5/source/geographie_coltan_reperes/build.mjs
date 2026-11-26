// Construit un fichier HTML autonome : ../../geographie_coltan_reperes.html
import { build } from "esbuild";
import fs from "fs";
const r = await build({
  entryPoints: ["src/main.jsx"], bundle: true, minify: true, write: false, format: "iife",
  target: ["chrome90", "safari15", "firefox90"], define: { "process.env.NODE_ENV": '"production"' },
  jsx: "automatic", charset: "utf8", legalComments: "none", loader: { ".json": "json" },
});
const js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const fonts = [["400", "noto-sans-latin-400-normal.woff2"], ["600", "noto-sans-latin-600-normal.woff2"], ["700", "noto-sans-latin-700-normal.woff2"]]
  .map(([w, f]) => `@font-face{font-family:'Noto Sans';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync("node_modules/@fontsource/noto-sans/files/" + f).toString("base64")}) format('woff2')}`).join("\n");
const css = fs.readFileSync("src/style.css", "utf8");
const html = fs.readFileSync("src/template.html", "utf8")
  .replace("/*FONTS*/", () => fonts).replace("/*CSS*/", () => css).replace("<!--SCRIPT-->", () => `<script>${js}</script>`);
const out = process.argv[2] || "../../geographie_coltan_reperes.html";
fs.writeFileSync(out, html);
console.log("ok", out, (html.length / 1024).toFixed(0) + " Ko");
