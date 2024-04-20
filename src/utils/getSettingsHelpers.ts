import * as vscode from "vscode";
import {
  SUPPORTED_FORMATS,
  SUPPORTED_FORMATS_FOR_COMPRESS,
  SUPPORTED_FORMATS_FOR_WEBP_CONVERTING,
} from "../constants";

export const checkIfFormatSupported = (format: string | undefined) => {
  return format ? SUPPORTED_FORMATS.includes(format) : false;
};

export const checkIfSupportedFormatForCompress = (inputFormat: string) => {
  return SUPPORTED_FORMATS_FOR_COMPRESS.some(
    (format) => format === inputFormat,
  );
};

export const checkIfSupportedFormatForConvetingToWebP = (
  inputFormat: string,
) => {
  return SUPPORTED_FORMATS_FOR_WEBP_CONVERTING.some(
    (format) => format === inputFormat,
  );
};

const getConfiguration = (key: string) => {
  return vscode.workspace.getConfiguration().get(`image-editor.${key}`);
};

export const getQualitySetting = () => getConfiguration("quality") as number;

export const getOverwriteOriginalSetting = () =>
  getConfiguration("overwrite-original") as boolean;

export const getSaveLimitSetting = () =>
  getConfiguration("save-limit") as number;
