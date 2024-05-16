export function getEnvironmentVariable(name: string): string {
  const val = import.meta.env[name];
  if (val === undefined || val === null) {
    throw new Error("missing env var for " + name);
  }
  return val;
}
