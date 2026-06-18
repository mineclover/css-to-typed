import type * as vscode from 'vscode'
import { activate as activateCSS } from './cssCommands'
import { registerHoverProvider } from './hoverProvider'
import { activate as activateTypeScript } from './typeScriptCommands'

export function activate(context: vscode.ExtensionContext) {
  activateCSS(context)
  activateTypeScript(context)
  registerHoverProvider(context)
}
