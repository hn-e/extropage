// Suppress THREE.Clock deprecation warning from R3F internals
// three.js 0.184+ deprecated Clock in favor of Timer, but R3F v9.6.1 hasn't migrated yet
const origWarn = console.warn;
console.warn = function (...args: unknown[]) {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (msg.includes("THREE.Clock") && msg.includes("deprecated")) return;
  origWarn.apply(console, args);
};
