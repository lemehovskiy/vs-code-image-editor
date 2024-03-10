import * as vscode from "vscode";
import sharp from "sharp";
import fs from "fs";
import { showMessageOfOperationResult } from "./utils/showMessageOfOperationResult";
import { OPERATIONS_TYPES } from "./types";
import {
  getQualitySetting,
  checkIfFormatSupported,
} from "./utils/getSettingsHelpers";
import { rotate } from "./operations/rotate";
import { writeToFile } from "./utils/writeToFile";

sharp.cache(false);

export function activate(context: vscode.ExtensionContext) {
  const rotateLeft = vscode.commands.registerCommand(
    "image-editor.rotateLeft",
    async (_currentFile, selectedFiles) => {
      const result = await rotate(selectedFiles, -90);
      showMessageOfOperationResult(result, OPERATIONS_TYPES.RotateRight);
    },
  );

  const rotateRight = vscode.commands.registerCommand(
    "image-editor.rotateRight",
    async (_currentFile, selectedFiles) => {
      const result = await rotate(selectedFiles, 90);
      showMessageOfOperationResult(result, OPERATIONS_TYPES.RotateRight);
    },
  );

  const compress = vscode.commands.registerCommand(
    "image-editor.compress",
    async (...commandArgs) => {
      vscode.window.showInformationMessage("Compressed successfully");

      if (commandArgs[1][0] instanceof vscode.Uri) {
        const QUALITY = getQualitySetting();

        for (const resource of commandArgs[1]) {
          const { format } = await sharp(resource.fsPath).metadata();

          let buffer;

          if (format === "png") {
            buffer = await sharp(resource.fsPath)
              .png({ quality: QUALITY })
              .toBuffer();
          } else if (format === "jpeg") {
            buffer = await sharp(resource.fsPath)
              .jpeg({ quality: QUALITY })
              .toBuffer();
          } else if (format === "webp") {
            buffer = await sharp(resource.fsPath)
              .webp({ quality: QUALITY })
              .toBuffer();
          }

          if (buffer) {
            writeToFile(resource.fsPath, buffer, OPERATIONS_TYPES.Compress);
          }
        }
      }
    },
  );

  const resize = vscode.commands.registerCommand(
    "image-editor.resize",
    async (...commandArgs) => {
      vscode.window.showInformationMessage("Resized successfully");

      if (commandArgs[1][0] instanceof vscode.Uri) {
        const width = await vscode.window.showInputBox({
          placeHolder: "Please enter a max width",
          validateInput: (text) => {
            return text !== "" ? null : "Empty string is not allowed";
          },
        });

        const height = await vscode.window.showInputBox({
          placeHolder: "Please enter a max heigth",
          validateInput: (text) => {
            return text !== "" ? null : "Empty string is not allowed";
          },
        });

        if (width && height) {
          for (const resource of commandArgs[1]) {
            const meta = await sharp(resource.fsPath).metadata();

            if (!checkIfFormatSupported(meta.format)) {
              continue;
            }

            const inputWidth = Number(width);
            const inputHeigh = Number(height);

            const params: sharp.ResizeOptions = {};
            if (meta.width && meta.height) {
              if (meta.width / inputWidth > meta.height / inputHeigh) {
                params.width = Number(width);
              } else {
                params.height = Number(height);
              }
              const buffer = await sharp(resource.fsPath)
                .resize(params)
                .toBuffer();
              writeToFile(resource.fsPath, buffer, OPERATIONS_TYPES.Resize);
            }
          }
        }
      }
    },
  );

  const convertToWebP = vscode.commands.registerCommand(
    "image-editor.convertToWebP",
    async (...commandArgs) => {
      vscode.window.showInformationMessage("Converted successfully");

      if (commandArgs[1][0] instanceof vscode.Uri) {
        const QUALITY = getQualitySetting();

        for (const resource of commandArgs[1]) {
          const { format } = await sharp(resource.fsPath).metadata();
          if (!checkIfFormatSupported(format)) {
            continue;
          }
          const buffer = await sharp(resource.fsPath)
            .webp({ quality: QUALITY })
            .toBuffer();
          const webpPath = resource.fsPath.replace(
            /(png|jpg|jpeg|gif)$/,
            "webp",
          );

          fs.writeFileSync(webpPath, buffer);
        }
      }
    },
  );

  context.subscriptions.push(rotateLeft);
  context.subscriptions.push(rotateRight);
  context.subscriptions.push(compress);
  context.subscriptions.push(resize);
  context.subscriptions.push(convertToWebP);
}

export function deactivate() {}
