import { SUPPORTED_FORMATS_FOR_COMPRESS } from "./constants";

export enum OPERATIONS_TYPES {
  "RotateLeft" = "Rotate Left",
  "RotateRight" = "Rotate Right",
  "Compress" = "Compress",
  "Resize" = "Resize",
  "ConvertToWebP" = "Convert to WebP",
  "CompressWithAutoFormat" = "Convert with auto format",
}

export type SUPPORTED_FORMATS_FOR_COMPRESS_TYPES =
  (typeof SUPPORTED_FORMATS_FOR_COMPRESS)[number];
