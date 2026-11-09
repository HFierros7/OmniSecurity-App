export function createLocalId() {
  if (typeof crypto.randomUUID !== "function") {
    throw new Error("El navegador no ofrece generación segura de claves locales.");
  }
  return crypto.randomUUID();
}
