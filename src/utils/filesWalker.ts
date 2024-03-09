import * as vscode from "vscode";

export const filesWalker = async (
  selectedFiles: Array<vscode.Uri>,
  callback: (path: string) => Promise<void>
) => {
  let processedFiles = 0;
  if (selectedFiles[0] instanceof vscode.Uri) {
    for (const resource of selectedFiles) {
      try {
        await callback(resource.fsPath);
        processedFiles++;
      } catch (e) {
        console.error(e);
      }
    }
  }
  return processedFiles;
};
