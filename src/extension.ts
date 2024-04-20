import * as vscode from "vscode";
import sharp from "sharp";
import { showMessageOfOperationResult } from "./utils/showMessageOfOperationResult";
import { OPERATIONS_TYPES } from "./types";
import {
  getQualitySetting,
  checkIfFormatSupported,
  getSaveLimitSetting,
} from "./utils/getSettingsHelpers";
import { rotate } from "./operations/rotate";
import { writeToFile } from "./utils/writeToFile";
import { filesWalker } from "./utils/filesWalker";
import { bulkShowInputBox } from "./utils/bulkShowInputBox";
import { checkIfCanReachSaveLimit } from "./utils/checkIfCanReachSaveLimit";

sharp.cache(false);

export function activate(context: vscode.ExtensionContext) {
  const rotateLeft = vscode.commands.registerCommand(
    "image-editor.rotateLeft",
    async (_currentFile, selectedFiles) => {
      const operationResult = await rotate(selectedFiles, -90);
      showMessageOfOperationResult(
        operationResult,
        OPERATIONS_TYPES.RotateLeft,
      );
    },
  );

  const rotateRight = vscode.commands.registerCommand(
    "image-editor.rotateRight",
    async (_currentFile, selectedFiles) => {
      const operationResult = await rotate(selectedFiles, 90);
      showMessageOfOperationResult(
        operationResult,
        OPERATIONS_TYPES.RotateRight,
      );
    },
  );

  const compress = vscode.commands.registerCommand(
    "image-editor.compress",
    async (_currentFile, selectedFiles) => {
      const QUALITY = getQualitySetting();
      const SAVE_LIMIT = getSaveLimitSetting();

      const operationResult = await filesWalker(
        selectedFiles,
        async (path: string) => {
          const { format } = await sharp(path).metadata();

          let buffer;

          if (format === "png") {
            buffer = await sharp(path)
              .png({ quality: QUALITY })
              .toBuffer({ resolveWithObject: true });
          } else if (format === "jpeg") {
            buffer = await sharp(path)
              .jpeg({ quality: QUALITY })
              .toBuffer({ resolveWithObject: true });
          } else if (format === "webp") {
            buffer = await sharp(path)
              .webp({ quality: QUALITY })
              .toBuffer({ resolveWithObject: true });
          } else {
            throw new Error("Input file contains unsupported image format");
          }

          if (checkIfCanReachSaveLimit(path, buffer.info.size, SAVE_LIMIT)) {
            writeToFile(path, buffer.data, OPERATIONS_TYPES.Compress);
          } else {
            throw new Error(`Save is less than ${SAVE_LIMIT}%`);
          }
        },
      );
      showMessageOfOperationResult(operationResult, OPERATIONS_TYPES.Compress);
    },
  );

  const resize = vscode.commands.registerCommand(
    "image-editor.resize",
    async (_currentFile, selectedFiles) => {
      if (selectedFiles[0] instanceof vscode.Uri) {
        const [width, height] = await bulkShowInputBox(
          [
            { placeholder: "Please enter a max width" },
            { placeholder: "Please enter a max height" },
          ],
          "number",
        );

        if (!width || !height) return;

        const operationResult = await filesWalker(
          selectedFiles,
          async (path: string) => {
            const meta = await sharp(path).metadata();

            if (!checkIfFormatSupported(meta.format)) {
              return;
            }

            const params: sharp.ResizeOptions = {};
            if (meta.width && meta.height) {
              if (meta.width / width > meta.height / height) {
                params.width = width;
              } else {
                params.height = height;
              }
              const buffer = await sharp(path).resize(params).toBuffer();
              writeToFile(path, buffer, OPERATIONS_TYPES.Resize);
            }
          },
        );
        showMessageOfOperationResult(operationResult, OPERATIONS_TYPES.Resize);
      }
    },
  );

  const convertToWebP = vscode.commands.registerCommand(
    "image-editor.convertToWebP",
    async (_currentFile, selectedFiles) => {
      const QUALITY = getQualitySetting();
      const SAVE_LIMIT = getSaveLimitSetting();

      const operationResult = await filesWalker(
        selectedFiles,
        async (path: string) => {
          const { format } = await sharp(path).metadata();
          if (!checkIfFormatSupported(format)) {
            return;
          }
          const buffer = await sharp(path)
            .webp({ quality: QUALITY })
            .toBuffer({ resolveWithObject: true });
          const webpPath = path.replace(/\..{3,4}$/, ".webp");

          if (checkIfCanReachSaveLimit(path, buffer.info.size, SAVE_LIMIT)) {
            writeToFile(webpPath, buffer.data, OPERATIONS_TYPES.Compress);
          } else {
            throw new Error(`Save is less than ${SAVE_LIMIT}%`);
          }
        },
      );
      showMessageOfOperationResult(
        operationResult,
        OPERATIONS_TYPES.ConvertToWebP,
      );
    },
  );

  context.subscriptions.push(rotateLeft);
  context.subscriptions.push(rotateRight);
  context.subscriptions.push(compress);
  context.subscriptions.push(resize);
  context.subscriptions.push(convertToWebP);
}

export function deactivate() {}
