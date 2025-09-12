export function utf8ToBase64(str: string) {
  const bytes = new TextEncoder().encode(str); // UTF-8 Uint8Array
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}
