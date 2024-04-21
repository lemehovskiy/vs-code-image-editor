import { ALL_FORMATS, SUPPORTED_FORMATS_FOR_COMPRESS } from "./constants";

export enum OPERATIONS_TYPES {
  "RotateLeft" = "Rotate Left",
  "RotateRight" = "Rotate Right",
  "Compress" = "Compress",
  "Resize" = "Resize",
  "ConvertToWebP" = "Convert to WebP",
  "CompressWithAutoFormat" = "Convert with auto format",
}

export type SupportedFormatsForCompressTypes =
  (typeof SUPPORTED_FORMATS_FOR_COMPRESS)[number];

export type FormatType = (typeof ALL_FORMATS)[number];
export type FormatTypes = Array<FormatType>;

export type InputFormatType = string | undefined;
