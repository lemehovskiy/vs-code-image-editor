import { OPERATIONS_TYPES } from "../types";
import * as vscode from "vscode";

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
  [OPERATIONS_TYPES.CovertToWebP]: {
    successMessage: "Converted to WebP",
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
  numberOfFiles: number,
  operationType: OPERATIONS_TYPES,
) => {
  if (numberOfFiles > 0) {
    const filesCount = getFilesCount(numberOfFiles);
    vscode.window.showInformationMessage(
      `${filesCount} ${OPERATIONS[operationType].successMessage} successfully`,
    );
  } else {
    vscode.window.showInformationMessage(`Nothing to ${operationType}`);
  }
};
