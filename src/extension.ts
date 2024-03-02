// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import sharp from "sharp";
import fs from "fs";

sharp.cache(false);
const SUPPORTED_FORMATS = ["png", "jpeg", "webp"];

const checkIfFormatSupported = (format: string | undefined) => {
  return format ? SUPPORTED_FORMATS.includes(format) : false;
};

const QUALITY = vscode.workspace
  .getConfiguration()
  .get("image-editor.quality") as number;

const OVERWRITE_ORIGINAL = vscode.workspace
  .getConfiguration()
  .get("image-editor.overwrite-original") as boolean;

let writeToFile = (path: string, buffer: Buffer) => {
  let newPath = path;

  if (!OVERWRITE_ORIGINAL) {
    newPath = newPath = path.replace(/(\..+)$/, " copy$1");
  }

  fs.writeFileSync(newPath, buffer);
};

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "image-editor" is now active!');

  let disposable = vscode.commands.registerCommand(
    "image-editor.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from image-editor!");
    }
  );

  let rotate = vscode.commands.registerCommand(
    "image-editor.rotate",
    async (...commandArgs) => {
      vscode.window.showInformationMessage("Rotated successfully");

      if (commandArgs[1][0] instanceof vscode.Uri) {
        for (const resource of commandArgs[1]) {
          const buffer = await sharp(resource.fsPath).rotate(90).toBuffer();
          fs.writeFileSync(resource.fsPath, buffer);
        }
      }
    }
  );

  let compress = vscode.commands.registerCommand(
    "image-editor.compress",
    async (...commandArgs) => {
      vscode.window.showInformationMessage("Compressed successfully");

      if (commandArgs[1][0] instanceof vscode.Uri) {
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
            writeToFile(resource.fsPath, buffer);
          }
        }
      }
    }
  );

  let resize = vscode.commands.registerCommand(
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
              writeToFile(resource.fsPath, buffer);
            }
          }
        }
      }
    }
  );

  let convertToWebP = vscode.commands.registerCommand(
    "image-editor.convertToWebP",
    async (...commandArgs) => {
      vscode.window.showInformationMessage("Converted successfully");

      // console.log(commandArgs);
      if (commandArgs[1][0] instanceof vscode.Uri) {
        for (const resource of commandArgs[1]) {
          const { format } = await sharp(resource.fsPath).metadata();
          if (!checkIfFormatSupported(format)) {
            continue;
          }
          const buffer = await sharp(resource.fsPath)
            .webp({ quality: QUALITY })
            .toBuffer();
          const webpPath = resource.fsPath.replace(/(png|jpg|jpeg)$/, "webp");

          fs.writeFileSync(webpPath, buffer);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(rotate);
  context.subscriptions.push(compress);
  context.subscriptions.push(resize);
  context.subscriptions.push(convertToWebP);
}

// This method is called when your extension is deactivated
export function deactivate() {}
