export type CompressedImage = {
  buffer: ArrayBuffer;
  fileName: string;
  contentType: string;
};

function shouldCompressImage(file: Blob): boolean {
  return (
    file.type.startsWith("image/") &&
    !file.type.includes("gif") &&
    !file.type.includes("svg")
  );
}

export async function compressImage(
  file: Blob & { name?: string },
): Promise<CompressedImage> {
  const buffer = await file.arrayBuffer();

  return {
    buffer,
    fileName: typeof file.name === "string" && file.name.length > 0 ? file.name : "image",
    contentType: file.type || "application/octet-stream",
  };
}

export async function compressFormDataImages(formData: FormData): Promise<FormData> {
  for (const [key, value] of Array.from(formData.entries())) {
    // Route-handler / undici uploads may arrive as Blob rather than File.
    if (typeof Blob === "undefined" || !(value instanceof Blob)) {
      continue;
    }

    if (!shouldCompressImage(value)) {
      continue;
    }

    try {
      const { buffer, fileName, contentType } = await compressImage(
        value as Blob & { name?: string },
      );
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
