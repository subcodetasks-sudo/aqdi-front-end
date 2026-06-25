export type CompressedImage = {
  buffer: ArrayBuffer;
  fileName: string;
  contentType: string;
};

function shouldCompressImage(file: File): boolean {
  return (
    file.type.startsWith("image/") &&
    !file.type.includes("gif") &&
    !file.type.includes("svg")
  );
}

export async function compressImage(file: File): Promise<CompressedImage> {
  const buffer = await file.arrayBuffer();

  return {
    buffer,
    fileName: file.name,
    contentType: file.type,
  };
}

export async function compressFormDataImages(formData: FormData): Promise<FormData> {
  for (const [key, value] of Array.from(formData.entries())) {
    if (!(value instanceof File) || !shouldCompressImage(value)) {
      continue;
    }

    try {
      const { buffer, fileName, contentType } = await compressImage(value);
      const compressedFile = new File([new Uint8Array(buffer)], fileName, {
        type: contentType,
      });
      formData.set(key, compressedFile);
    } catch {
      continue;
    }
  }

  return formData;
}
