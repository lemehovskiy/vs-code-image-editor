import * as vscode from "vscode";

type InputType = Array<{ placeholder: string }>;
type ReturnType<T> = Promise<Array<T>>;

function bulkShowInputBox(
  inputs: InputType,
  type: "number",
): ReturnType<number | undefined>;
function bulkShowInputBox(
  inputs: InputType,
  type: "string",
): ReturnType<string | undefined>;
async function bulkShowInputBox(
  inputs: InputType,
  type: string,
): ReturnType<unknown> {
  const result: Array<string | number | undefined> = [];

  for (const input of inputs) {
    const value = await vscode.window.showInputBox({
      placeHolder: input.placeholder,
      validateInput: (text) => {
        return text !== "" ? null : "Empty string is not allowed";
      },
    });

    if (value) {
      result.push(type === "number" ? Number(value) : value);
    } else {
      result.push(undefined);
    }
  }

  return result;
}

export { bulkShowInputBox };
