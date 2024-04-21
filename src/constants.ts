import { FormatTypes } from "./types";

export const FORMAT_PNG = "png" as const;
export const FORMAT_JPEG = "jpeg" as const;
export const FORMAT_WEBP = "webp" as const;
export const FORMAT_GIF = "gif" as const;

export const ALL_FORMATS = [
  FORMAT_PNG,
  FORMAT_JPEG,
  FORMAT_WEBP,
  FORMAT_GIF,
] as const;

export const SUPPORTED_FORMATS_FOR_RESIZE: FormatTypes = [
  FORMAT_PNG,
  FORMAT_JPEG,
  FORMAT_WEBP,
  FORMAT_GIF,
];

export const SUPPORTED_FORMATS_FOR_COMPRESS: Partial<FormatTypes> = [
  FORMAT_PNG,
  FORMAT_JPEG,
  FORMAT_WEBP,
] as const;

export const SUPPORTED_FORMATS_FOR_WEBP_CONVERTING: Partial<FormatTypes> = [
  FORMAT_PNG,
  FORMAT_JPEG,
  FORMAT_GIF,
] as const;
