// Génération des cartes du jeu « Symbole commun » (principe du Dobble).
// Plan projectif fini d'ordre n (n premier) : n² + n + 1 symboles et autant de cartes,
// n + 1 symboles par carte, et deux cartes quelconques partagent exactement un symbole.
// Ici n = 7 : 57 symboles, 57 cartes de 8 symboles.

export function genererCartes(n = 7) {
  const cartes = [];
  // n + 1 cartes qui contiennent toutes le symbole 0
  for (let i = 0; i <= n; i++) {
    const c = [0];
    for (let j = 0; j < n; j++) c.push(1 + i * n + j);
    cartes.push(c);
  }
  // n² cartes : une par couple (i, j)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const c = [i + 1];
      for (let k = 0; k < n; k++) c.push(n + 1 + n * k + ((i * k + j) % n));
      cartes.push(c);
    }
  }
  return cartes;
}

export function symboleCommun(a, b) {
  const s = new Set(a);
  const communs = b.filter((x) => s.has(x));
  return communs.length === 1 ? communs[0] : null;
}

// Vérification (utilisée au démarrage en développement et dans les tests)
export function verifierCartes(cartes) {
  for (let i = 0; i < cartes.length; i++)
    for (let j = i + 1; j < cartes.length; j++)
      if (symboleCommun(cartes[i], cartes[j]) === null) return false;
  return true;
}

export function melanger(tab) {
  const t = tab.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

// Disposition des 8 images sur une carte : une au centre, sept en couronne.
// Les coordonnées sont exprimées en fraction du rayon de la carte.
export function disposer(symboles, rotation) {
  const ordre = melanger(symboles);
  const decalage = Math.random() * Math.PI * 2;
  return ordre.map((id, k) => {
    let x = 0, y = 0;
    let taille = 0.42 + Math.random() * 0.06;
    if (k > 0) {
      const a = decalage + ((k - 1) * 2 * Math.PI) / 7 + (Math.random() - 0.5) * 0.12;
      const r = 0.6 + (Math.random() - 0.5) * 0.05;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r;
      taille = 0.36 + Math.random() * 0.08;
    }
    const angle = rotation ? Math.round((Math.random() - 0.5) * 120) : 0;
    return { id, x, y, taille, angle };
  });
}
