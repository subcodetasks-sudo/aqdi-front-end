export type PersistedFile = {
  name: string;
  type: string;
  lastModified: number;
  dataUrl: string;
};

const MAX_FILE_BYTES = 512 * 1024;

export function fileToPersisted(file: File): Promise<PersistedFile | null> {
  return new Promise((resolve) => {
    if (file.size > MAX_FILE_BYTES) {
      resolve(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        resolve(null);
        return;
      }

      resolve({
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
        dataUrl: reader.result,
      });
    };

    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export async function filesToPersisted(files: File[]): Promise<PersistedFile[]> {
  const results = await Promise.all(files.map(fileToPersisted));
  return results.filter((file): file is PersistedFile => file !== null);
}

export function persistedToFiles(persisted: PersistedFile[]): File[] {
  if (typeof window === "undefined") {
    return [];
  }

  return persisted.map((item) => {
    const base64 = item.dataUrl.split(",")[1] ?? "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new File([bytes], item.name, {
      type: item.type,
      lastModified: item.lastModified,
    });
  });
}
