import fs from "fs";

export function checkIfCanReachSaveLimit(
  filePath: string,
  fileSizeAfterCompression: number,
  saveLimit: number,
): boolean {
  const { size: currenFileSize } = fs.statSync(filePath);
  const CURRENT_SAVE = (currenFileSize / fileSizeAfterCompression) * 100 - 100;

  return CURRENT_SAVE > saveLimit;
}
