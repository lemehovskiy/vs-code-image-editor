import * as vscode from "vscode";
import { SUPPORTED_FORMATS } from "../constants";

export const checkIfFormatSupported = (format: string | undefined) => {
  return format ? SUPPORTED_FORMATS.includes(format) : false;
};

const getConfiguration = (key: string) => {
  return vscode.workspace.getConfiguration().get(`image-editor.${key}`);
};

export const getQualitySetting = () => getConfiguration("quality") as number;

export const getOverwriteOriginalSetting = () =>
  getConfiguration("overwrite-original") as boolean;

export const getSaveLimitSetting = () =>
  getConfiguration("save-limit") as number;
