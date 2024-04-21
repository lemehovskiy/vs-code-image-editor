import * as vscode from "vscode";
import sharp from "sharp";
import { filesWalker } from "../utils/filesWalker";
import { OPERATIONS_TYPES } from "../types";
import { bulkShowInputBox } from "../utils/bulkShowInputBox";
import { checkIfFormatSupportedForResize } from "../utils/getSettingsHelpers";
import { showMessageOfOperationResult } from "../utils/showMessageOfOperationResult";
import { writeToFile } from "../utils/writeToFile";

export const resizeByOneAxis = async (
  selectedFiles: Array<vscode.Uri>,
  axis: "width" | "height",
) => {
  if (selectedFiles[0] instanceof vscode.Uri) {
    const [value] = await bulkShowInputBox(
      [{ placeholder: `Please enter a ${axis}` }],
      "number",
    );

    if (!value) return;

    const operationResult = await filesWalker(
      selectedFiles,
      async (path: string) => {
        const meta = await sharp(path).metadata();

        if (!checkIfFormatSupportedForResize(meta.format)) {
          return;
        }

        const params: sharp.ResizeOptions = {};

        if (axis === "width") {
          params.width = value;
        } else {
          params.height = value;
        }
        const buffer = await sharp(path).resize(params).toBuffer();
        writeToFile(path, buffer, OPERATIONS_TYPES.Resize);
      },
    );
    showMessageOfOperationResult(operationResult, OPERATIONS_TYPES.Resize);
  }
};
