export function loadFileFromFileSystem(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function() {
      resolve(reader.result as string);
    };

    reader.onerror = reject;
    reader.onabort = reject;

    reader.readAsText(file);
  });
}