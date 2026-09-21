import {
  persistedToFiles,
  type PersistedFile,
} from "@/lib/storage/persisted-files";

/** Prefer the in-memory File; fall back to reconstructing from draft persist. */
export function resolveDraftFile(
  files: File[],
  persistedFiles: PersistedFile[],
): File | undefined {
  if (files[0]) {
    return files[0];
  }

  return persistedToFiles(persistedFiles)[0];
}
