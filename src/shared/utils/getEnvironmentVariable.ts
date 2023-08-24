export function getEnvironmentVariable(name: string): string {
  let val = process.env[name];
  if (val === undefined || val === null) {
    throw new Error("missing env var for " + name);
  }
  return val;
}
