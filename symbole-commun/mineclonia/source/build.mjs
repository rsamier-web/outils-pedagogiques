// Construit ../index.html (React + JS intégrés dans un seul fichier) et met à jour la liste
// des fichiers mis en cache par le service worker.  Utilisation : npm install && node build.mjs
import { build } from "esbuild";
import fs from "fs";
const r = await build({ entryPoints: ["src/main.jsx"], bundle: true, minify: true, write: false, format: "iife",
  target: ["chrome90", "safari15", "firefox90"], define: { "process.env.NODE_ENV": '"production"' }, jsx: "automatic",
  charset: "utf8", legalComments: "none", loader: { ".json": "json" } });
const js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const html = fs.readFileSync("src/template.html", "utf8").replace("<!--SCRIPT-->", () => `<script>${js}</script>`);
fs.writeFileSync("../index.html", html);
const imgs = fs.readdirSync("../img").sort().map((f) => `'./img/${f}'`);
const sw = fs.readFileSync("src/sw-template.js", "utf8").replace("/*IMAGES*/", imgs.join(",\n  "))
  .replace("/*VERSION*/", "sc-mineclonia-" + Date.now().toString(36));
fs.writeFileSync("../sw.js", sw);
console.log("ok", (html.length / 1024).toFixed(0) + " Ko,", imgs.length, "images");
