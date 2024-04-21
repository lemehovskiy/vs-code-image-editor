import { OPERATIONS_TYPES } from "../types";
import { getOverwriteOriginalSetting } from "./getSettingsHelpers";
import fs from "fs";

export const writeToFile = (
  path: string,
  buffer: Buffer,
  operationType: OPERATIONS_TYPES,
) => {
  let newPath = path;

  if (
    [OPERATIONS_TYPES.Compress, OPERATIONS_TYPES.Resize].includes(operationType)
  ) {
    const OVERWRITE_ORIGINAL = getOverwriteOriginalSetting();
    if (!OVERWRITE_ORIGINAL) {
      newPath = newPath = path.replace(/(\..+)$/, " copy$1");
    }
  }

  fs.writeFileSync(newPath, buffer);

  return true;
};
