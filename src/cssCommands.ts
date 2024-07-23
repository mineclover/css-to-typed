import * as vscode from "vscode";
import { getAllClassNames } from "./cssParser";
import { createFile, copyTextToClipboard } from "./fileUtils";
import { getFilePath, getDocumentText } from "./vscodeUtils";
import { arrayToStringTyped } from "./typeUtils";

export function activate(context: vscode.ExtensionContext) {
  const createType = vscode.commands.registerCommand(
    "extension.createType",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const { name, folder } = getFilePath(editor.document.uri);
      if (!name) return;
      if (!(name.endsWith(".css") || name.endsWith(".scss"))) return;
      const fullText = getDocumentText(editor.document);
      const classes = getAllClassNames(fullText);
      const context = arrayToStringTyped(classes, name.split(".")[0]);
      const newName = name.replace(/(\.css|\.scss)$/, ".d.ts");
      createFile(folder + "/" + newName, context);
    }
  );

  const clipboardType = vscode.commands.registerCommand(
    "extension.clipboardType",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const { name } = getFilePath(editor.document.uri);
      if (!name) return;
      if (!(name.endsWith(".css") || name.endsWith(".scss"))) return;
      const fullText = getDocumentText(editor.document);
      const classes = getAllClassNames(fullText);
      const context = arrayToStringTyped(classes, name.split(".")[0]);
      copyTextToClipboard(context);
    }
  );

  context.subscriptions.push(createType, clipboardType);
}
