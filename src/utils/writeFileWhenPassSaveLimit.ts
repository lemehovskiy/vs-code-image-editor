import { OutputInfo } from "sharp";
import { OPERATIONS_TYPES } from "../types";
import { checkIfCanReachSaveLimit } from "./checkIfCanReachSaveLimit";
import { writeToFile } from "./writeToFile";

export async function writeFileWhenPassSaveLimit(
  path: string,
  writePath: string,
  buffer: { data: Buffer; info: OutputInfo },
  SAVE_LIMIT: number,
  operationType: OPERATIONS_TYPES,
) {
  if (checkIfCanReachSaveLimit(path, buffer.info.size, SAVE_LIMIT)) {
    writeToFile(writePath, buffer.data, operationType);
  } else {
    throw new Error(`Save is less than ${SAVE_LIMIT}%`);
  }
}
