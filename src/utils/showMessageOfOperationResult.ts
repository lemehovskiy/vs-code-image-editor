import { OPERATIONS_TYPES } from "../types";
import * as vscode from "vscode";
import { FilesWalkerReturnType } from "./filesWalker";

type OperationMessageType = {
  successMessage: string;
};

type OperationsMessageType = Record<OPERATIONS_TYPES, OperationMessageType>;

const OPERATIONS: OperationsMessageType = {
  [OPERATIONS_TYPES.RotateLeft]: {
    successMessage: "Rotated Left",
  },
  [OPERATIONS_TYPES.RotateRight]: {
    successMessage: "Rotated Right",
  },
  [OPERATIONS_TYPES.Compress]: {
    successMessage: "Compressed",
  },
  [OPERATIONS_TYPES.Resize]: {
    successMessage: "Resized",
  },
  [OPERATIONS_TYPES.ConvertToWebP]: {
    successMessage: "Converted to WebP",
  },
  [OPERATIONS_TYPES.CompressWithAutoFormat]: {
    successMessage: "Compressed with auto format",
  },
};

const getFilesCount = (numberOfFiles: number) => {
  if (numberOfFiles === 1) {
    return "1 file";
  } else if (numberOfFiles > 1) {
    return `${numberOfFiles} files`;
  }
};

export const showMessageOfOperationResult = (
  operationResult: FilesWalkerReturnType,
  operationType: OPERATIONS_TYPES,
) => {
  const { processedFiles, errorFiles } = operationResult;
  if (processedFiles > 0) {
    const filesCount = getFilesCount(processedFiles);
    vscode.window.showInformationMessage(
      `${filesCount} ${OPERATIONS[operationType].successMessage} successfully`,
    );
  } else {
    vscode.window.showInformationMessage(`Nothing to ${operationType}`);
  }

  if (errorFiles.length > 0) {
    const resultObj: Record<string, Array<string>> = {};

    errorFiles.forEach(({ path, errorMessage }) => {
      if (!resultObj[errorMessage]) {
        resultObj[errorMessage] = [];
      }
      resultObj[errorMessage].push(path);
    });

    for (const [key, value] of Object.entries(resultObj)) {
      const filesCount = getFilesCount(value.length);
      vscode.window.showErrorMessage(`${filesCount} failed with ${key} error`);
    }
  }
};
