import * as vscode from "vscode";

export type FilesWalkerReturnType = {
  processedFiles: number;
  errorFiles: Array<{ path: string; errorMessage: string }>;
};

export const filesWalker = async (
  selectedFiles: Array<vscode.Uri>,
  callback: (path: string) => Promise<void>,
): Promise<FilesWalkerReturnType> => {
  let processedFiles = 0;
  const errorFiles = [];
  if (selectedFiles[0] instanceof vscode.Uri) {
    for (const resource of selectedFiles) {
      try {
        await callback(resource.fsPath);
        processedFiles++;
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        errorFiles.push({
          path: resource.fsPath,
          errorMessage: message,
        });
      }
    }
  }
  return { processedFiles, errorFiles };
};
