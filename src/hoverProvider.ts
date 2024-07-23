import * as vscode from "vscode";
import { getInferredType } from "./typeInference";
import { inferredTypeMap, setCurrentHoverKey } from "./state";

export function registerHoverProvider(context: vscode.ExtensionContext) {
  const hover = vscode.languages.registerHoverProvider(
    ["typescript", "typescriptreact"],
    {
      async provideHover(document, position, token) {
        try {
          const inferredType = await getInferredType(document, position);
          if (inferredType) {
            const showTypeOnHover = vscode.workspace
              .getConfiguration("cssToTyped")
              .get("showTypeOnHover");
            const contents = new vscode.MarkdownString();
            contents.isTrusted = true;
            contents.supportHtml = true;

            const hoverKey = `${document.uri.toString()}:${position.line}:${
              position.character
            }`;
            inferredTypeMap.set(hoverKey, inferredType);
            setCurrentHoverKey(hoverKey);

            if (showTypeOnHover) {
              contents.appendCodeblock(inferredType, "typescript");
              contents.appendMarkdown("\n");
            }

            contents.appendMarkdown(
              `<a href="command:cssToTyped.copyInferredType">Copy Inferred Type</a>`
            );

            return new vscode.Hover(contents);
          }
        } catch (error) {
          console.error("Error in hover provider:", error);
        }
        return null;
      },
    }
  );

  context.subscriptions.push(hover);

  const selectionChangeDisposable =
    vscode.window.onDidChangeTextEditorSelection(() => {
      setCurrentHoverKey(null);
    });

  context.subscriptions.push(selectionChangeDisposable);
}
