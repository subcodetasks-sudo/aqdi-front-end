import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(process.cwd(), "public", "images");

/**
 * Re-encode heavy homepage / marketing bitmaps to WebP and replace the originals
 * with reasonably sized PNGs only when WebP isn't usable as a drop-in.
 * For photos, we write `.webp` and also overwrite the `.png` with a much smaller
 * resized PNG so existing paths don't 404 if something still points at them.
 */
const targets = [
  { file: "hero.png", edge: 1440 },
  { file: "app-banner.png", edge: 1628 },
  { file: "contract-img.png", edge: 1400 },
  { file: "support-banner.png", edge: 1200 },
  { file: "services-1.png", edge: 1200 },
  { file: "services-2.png", edge: 1200 },
  { file: "properties.png", edge: 1200 },
  { file: "vision.png", edge: 1200 },
  { file: "user.jpg", edge: 800 },
];

async function compressOne(file, edge) {
  const input = path.join(root, file);
  if (!fs.existsSync(input)) {
    console.log("skip missing", file);
    return;
  }

  const before = fs.statSync(input).size;
  const isJpeg = /\.jpe?g$/i.test(file);
  const resized = sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: edge,
      height: edge,
      fit: "inside",
      withoutEnlargement: true,
    });

  if (isJpeg) {
    const tmp = `${input}.tmp`;
    await resized.jpeg({ quality: 78, mozjpeg: true }).toFile(tmp);
    fs.renameSync(tmp, input);
    const after = fs.statSync(input).size;
    console.log(
      `${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
    );
    return;
  }

  const webpPath = input.replace(/\.png$/i, ".webp");
  await resized.clone().webp({ quality: 78 }).toFile(webpPath);

  // Keep a smaller PNG fallback for any hard-coded .png references.
  const tmp = `${input}.tmp`;
  await resized
    .clone()
    .png({ compressionLevel: 9, quality: 70, effort: 10 })
    .toFile(tmp);
  fs.renameSync(tmp, input);

  const after = fs.statSync(input).size;
  const webpSize = fs.statSync(webpPath).size;
  console.log(
    `${file}: ${(before / 1024).toFixed(0)}KB -> png ${(after / 1024).toFixed(0)}KB / webp ${(webpSize / 1024).toFixed(0)}KB`,
  );
}

for (const t of targets) {
  await compressOne(t.file, t.edge);
}
