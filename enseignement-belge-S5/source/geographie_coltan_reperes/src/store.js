import { useState, useEffect, useRef } from "react";

const PREFIX = "geoS5coltan.";
export function load(key, init) {
  try { const v = localStorage.getItem(PREFIX + key); return v == null ? init : JSON.parse(v); } catch (e) { return init; }
}
export function save(key, val) { try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch (e) { /* stockage indisponible */ } }
export function usePersist(key, init) {
  const [v, setV] = useState(() => load(key, init));
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } save(key, v); }, [key, v]);
  return [v, setV];
}
export function resetAll() {
  try { Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k)); } catch (e) { /* rien */ }
}
export const today = () => new Date().toISOString().slice(0, 10);
