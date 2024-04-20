import sharp from "sharp";
import {
  checkIfSupportedFormatForCompress,
  checkIfSupportedFormatForConvetingToWebP,
} from "./getSettingsHelpers";

export async function getBufferForWebP(
  path: string,
  format: string,
  QUALITY: number,
) {
  if (!checkIfSupportedFormatForConvetingToWebP(format)) {
    return;
  }
  const buffer = await sharp(path)
    .webp({ quality: QUALITY })
    .toBuffer({ resolveWithObject: true });

  return buffer;
}

export async function getBufferByFileType(
  path: string,
  format: string,
  QUALITY: number,
) {
  if (!checkIfSupportedFormatForCompress(format)) {
    return;
  }

  let buffer;

  if (format === "png") {
    buffer = await sharp(path)
      .png({ quality: QUALITY })
      .toBuffer({ resolveWithObject: true });
  } else if (format === "jpeg") {
    buffer = await sharp(path)
      .jpeg({ quality: QUALITY })
      .toBuffer({ resolveWithObject: true });
  } else if (format === "webp") {
    buffer = await getBufferForWebP(path, format, QUALITY);
  } else {
    throw new Error("Input file contains unsupported image format");
  }

  return buffer;
}
