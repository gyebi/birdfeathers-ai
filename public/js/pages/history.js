const KEY = "bf_cycles";

export function getAllCycles() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function clearAllCycles() {
  localStorage.removeItem(KEY);
}