import * as vscode from "vscode";
import sharp from "sharp";
import { filesWalker } from "../utils/filesWalker";
import fs from "fs";

export const rotate = async (selectedFiles: Array<vscode.Uri>, deg: number) => {
  const processedFiles = await filesWalker(
    selectedFiles,
    async (path: string) => {
      const buffer = await sharp(path).rotate(deg).toBuffer();
      fs.writeFileSync(path, buffer);
    },
  );

  return processedFiles;
};
