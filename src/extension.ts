import * as vscode from "vscode";
import sharp from "sharp";
import { showMessageOfOperationResult } from "./utils/showMessageOfOperationResult";
import { OPERATIONS_TYPES } from "./types";
import {
  getQualitySetting,
  checkIfFormatSupportedForResize,
  getSaveLimitSetting,
  getWebPDeleteOriginalSetting,
} from "./utils/getSettingsHelpers";
import { rotate } from "./operations/rotate";
import { writeToFile } from "./utils/writeToFile";
import { filesWalker } from "./utils/filesWalker";
import { bulkShowInputBox } from "./utils/bulkShowInputBox";
import {
  getBufferByFileType,
  getBufferForWebP,
} from "./utils/getBufferHelpers";
import fs from "fs";
import { getWebPPath } from "./utils/getWebPPath";
import { writeFileWhenPassSaveLimit } from "./utils/writeFileWhenPassSaveLimit";
import { resizeByOneAxis } from "./operations/resize";

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

          if (!format) return;

          const buffer = await getBufferByFileType(path, format, QUALITY);

          if (!buffer) return;

          writeFileWhenPassSaveLimit(
            path,
            path,
            buffer,
            SAVE_LIMIT,
            OPERATIONS_TYPES.Compress,
          );
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

            if (!checkIfFormatSupportedForResize(meta.format)) {
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

  const resizeByWidth = vscode.commands.registerCommand(
    "image-editor.resizeByWidth",
    async (_currentFile, selectedFiles) => {
      resizeByOneAxis(selectedFiles, "width");
    },
  );

  const resizeByHeigh = vscode.commands.registerCommand(
    "image-editor.resizeByHeight",
    async (_currentFile, selectedFiles) => {
      resizeByOneAxis(selectedFiles, "height");
    },
  );

  const convertToWebP = vscode.commands.registerCommand(
    "image-editor.convertToWebP",
    async (_currentFile, selectedFiles) => {
      const QUALITY = getQualitySetting();
      const SAVE_LIMIT = getSaveLimitSetting();
      const DELETE_ORIGINAL = getWebPDeleteOriginalSetting();

      const operationResult = await filesWalker(
        selectedFiles,
        async (path: string) => {
          const { format } = await sharp(path).metadata();
          if (!format) return;
          const buffer = await getBufferForWebP(path, format, QUALITY);
          if (!buffer) return;
          const webpPath = getWebPPath(path);

          const writeOk = writeFileWhenPassSaveLimit(
            path,
            webpPath,
            buffer,
            SAVE_LIMIT,
            OPERATIONS_TYPES.ConvertToWebP,
          );

          if (writeOk && DELETE_ORIGINAL) {
            fs.unlinkSync(path);
          }
        },
      );
      showMessageOfOperationResult(
        operationResult,
        OPERATIONS_TYPES.ConvertToWebP,
      );
    },
  );

  const compressWithAutoFormat = vscode.commands.registerCommand(
    "image-editor.compressWithAutoFormat",
    async (_currentFile, selectedFiles) => {
      const QUALITY = getQualitySetting();
      const SAVE_LIMIT = getSaveLimitSetting();
      const DELETE_ORIGINAL = getWebPDeleteOriginalSetting();

      const operationResult = await filesWalker(
        selectedFiles,
        async (path: string) => {
          const { format } = await sharp(path).metadata();
          if (!format) return;

          const compressedBuffer = await getBufferByFileType(
            path,
            format,
            QUALITY,
          );

          const webpBuffer = await getBufferForWebP(path, format, QUALITY);

          let isWebPSmaller = false;
          let isWebPResult = false;

          let resultPath = null;
          let resultBuffer = null;

          if (compressedBuffer && webpBuffer) {
            isWebPSmaller = webpBuffer.info.size < compressedBuffer.info.size;
            if (isWebPSmaller) {
              resultPath = getWebPPath(path);
              resultBuffer = webpBuffer;
              isWebPResult = true;
            } else {
              resultPath = path;
              resultBuffer = compressedBuffer;
            }
          } else if (webpBuffer) {
            resultPath = getWebPPath(path);
            resultBuffer = webpBuffer;
            isWebPResult = true;
          } else {
            return;
          }

          writeFileWhenPassSaveLimit(
            path,
            resultPath,
            resultBuffer,
            SAVE_LIMIT,
            OPERATIONS_TYPES.CompressWithAutoFormat,
          );

          if (isWebPResult && DELETE_ORIGINAL) {
            fs.unlinkSync(path);
          }
        },
      );
      showMessageOfOperationResult(
        operationResult,
        OPERATIONS_TYPES.CompressWithAutoFormat,
      );
    },
  );

  context.subscriptions.push(rotateLeft);
  context.subscriptions.push(rotateRight);
  context.subscriptions.push(compress);
  context.subscriptions.push(resize);
  context.subscriptions.push(resizeByWidth);
  context.subscriptions.push(resizeByHeigh);
  context.subscriptions.push(convertToWebP);
  context.subscriptions.push(compressWithAutoFormat);
}

export function deactivate() {}
