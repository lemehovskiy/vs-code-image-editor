import * as vscode from "vscode";
import {
  SUPPORTED_FORMATS_FOR_RESIZE,
  SUPPORTED_FORMATS_FOR_COMPRESS,
  SUPPORTED_FORMATS_FOR_WEBP_CONVERTING,
} from "../constants";
import { FormatTypes, InputFormatType } from "../types";

const checkFormat = (
  inputFormat: InputFormatType,
  supportedFormats: Partial<FormatTypes>,
) => {
  return supportedFormats.some((format) => format === inputFormat);
};

export const checkIfFormatSupportedForResize = (inputFormat: InputFormatType) =>
  checkFormat(inputFormat, SUPPORTED_FORMATS_FOR_RESIZE);

export const checkIfSupportedFormatForCompress = (
  inputFormat: InputFormatType,
) => checkFormat(inputFormat, SUPPORTED_FORMATS_FOR_COMPRESS);

export const checkIfSupportedFormatForConvetingToWebP = (
  inputFormat: InputFormatType,
) => checkFormat(inputFormat, SUPPORTED_FORMATS_FOR_WEBP_CONVERTING);

const getConfiguration = (key: string) => {
  return vscode.workspace.getConfiguration().get(`image-editor.${key}`);
};

export const getQualitySetting = () => getConfiguration("quality") as number;

export const getOverwriteOriginalSetting = () =>
  getConfiguration("overwrite-original") as boolean;

export const getSaveLimitSetting = () =>
  getConfiguration("save-limit") as number;
