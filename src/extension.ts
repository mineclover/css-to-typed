import * as vscode from "vscode";
import { activate as activateCSS } from "./cssCommands";
import { activate as activateTypeScript } from "./typeScriptCommands";
import { registerHoverProvider } from "./hoverProvider";

export function activate(context: vscode.ExtensionContext) {
  activateCSS(context);
  activateTypeScript(context);
  registerHoverProvider(context);
}
