export function inlineFor<T>(length: number, callback: (index: number) => T) {
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    result.push(callback(i));
  }
  return result;
}
