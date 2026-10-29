# Vortminejo — instalado ĉe GitHub Pages

*Riĉa vortaro estas ora minejo!*

1. En via deponejo (ekzemple `outils-pedagogiques`) kreu dosierujon `vortminejo`.
2. Metu en ĝin ĉiujn dosierojn kaj la dosierujon `i18n` de ĉi tiu arkivo.
3. Atendu unu aŭ du minutojn kaj malfermu: https://<uzantonomo>.github.io/<deponejo>/vortminejo/
4. En Chrome (komputilo aŭ Androido): menuo ⋮ → «Instali la aplikaĵon» (aŭ «Aldoni al la hejmekrano»).

Vortminejo havas propran identigilon (`vortminejo`), proprajn dosiernomojn kaj propran kaŝmemoron:
ĝi povas esti instalita apud Ludvortaro kaj Ludlernejo sen anstataŭigi ilin.

## Ĝisdatigo
Anstataŭigu index.html (kaj eventuale la dosierojn en i18n) kaj ŝanĝu la valoron VERSIO en sw-vortminejo.js
(ekzemple `vortminejo-v2`).

## Tradukoj (i18n)
Ĉiu dosiero `i18n/<lingvo>.json` enhavas por ĉiu vorto: [traduko, fonto].
Fonto «r»: Reta Vortaro (ReVo, permesilo GPL 2). Fonto «p»: propono ankoraŭ ne kontrolita.
Fonto «e»: angla traduko anstataŭ mankanta traduko. Korektoj estas bonvenaj.

## Sonoj (estonte)
La aplikaĵo uzas la voĉan legadon de la aparato. Por uzi antaŭe registritajn sonojn (ekzemple de la Piper-voĉo
de Grupo Esperanto Valencia), metu la sondosierojn en dosierujon `audio` kaj plenigu la objekton
`audio` en DATA: {"teksto": "audio/dosiero.mp3"}.

## Permesiloj
Bildoj: teksturoj de MineClone 2 (VoxeLibre), bazitaj sur «Pixel Perfection» de XSSheep, CC BY-SA 4.0.
Tradukoj el Reta Vortaro: GPL 2.
