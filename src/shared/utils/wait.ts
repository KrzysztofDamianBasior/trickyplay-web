export function wait<T>(value: T, duration: number): Promise<T> {
  return new Promise<T>((resolve) =>
    setTimeout(() => resolve(value), duration)
  );
}
