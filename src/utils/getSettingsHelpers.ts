import * as vscode from "vscode";
import { SUPPORTED_FORMATS } from "../constants";

export const checkIfFormatSupported = (format: string | undefined) => {
  return format ? SUPPORTED_FORMATS.includes(format) : false;
};

export const getQualitySetting = () =>
  vscode.workspace.getConfiguration().get("image-editor.quality") as number;

export const getOverwriteOriginalSetting = () =>
  vscode.workspace
    .getConfiguration()
    .get("image-editor.overwrite-original") as boolean;
