import { build } from "esbuild";
import fs from "fs";
const r = await build({ entryPoints: ["src/main.jsx"], bundle: true, minify: true, write: false, format: "iife",
  target: ["chrome90", "safari15", "firefox90"], define: { "process.env.NODE_ENV": '"production"' }, jsx: "automatic", charset: "utf8", legalComments: "none" });
let js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const fonts = [["Andika","andika/files/andika-latin-400-normal.woff2"],["Atkinson Hyperlegible","atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2"],["Lexend","lexend/files/lexend-latin-400-normal.woff2"]]
  .map(([n,f]) => `@font-face{font-family:'${n}';font-style:normal;font-weight:400 700;font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync("node_modules/@fontsource/"+f).toString("base64")}) format('woff2')}`).join("\n");
let html = fs.readFileSync("src/template.html", "utf8").replace("/*FONTS*/", () => fonts).replace("<!--SCRIPT-->", () => `<script>${js}</script>`);
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", html);
console.log("ok", (html.length/1024).toFixed(0)+" Ko");
