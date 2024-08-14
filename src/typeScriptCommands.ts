import * as vscode from "vscode";
import { inferredTypeMap, currentHoverKey } from "./state";
import { typeToConstantObject } from "./typeUtils";
export function activate(context: vscode.ExtensionContext) {
  const copyInferredType = vscode.commands.registerCommand(
    "cssToTyped.copyInferredType",
    async () => {
      if (!currentHoverKey) {
        vscode.window.showErrorMessage("No type to copy");
        return;
      }

      const inferredType = inferredTypeMap.get(currentHoverKey);
      if (inferredType) {
        try {
          await vscode.env.clipboard.writeText(inferredType);
          vscode.window.showInformationMessage(
            "Inferred type copied to clipboard"
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            "Error copying inferred type to clipboard"
          );
        }
      } else {
        vscode.window.showInformationMessage(
          "No type could be inferred at this position"
        );
      }
    }
  );

  const copyConstantObject = vscode.commands.registerCommand(
    "cssToTyped.copyConstantObject",
    async () => {
      if (!currentHoverKey) {
        vscode.window.showErrorMessage("No type to copy");
        return;
      }

      const inferredType = inferredTypeMap.get(currentHoverKey);
      if (inferredType) {
        try {
          const constantObject = typeToConstantObject(inferredType);
          await vscode.env.clipboard.writeText(constantObject);
          vscode.window.showInformationMessage(
            "Constant object copied to clipboard"
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            "Error copying constant object to clipboard"
          );
        }
      } else {
        vscode.window.showInformationMessage(
          "No type could be inferred at this position"
        );
      }
    }
  );

  context.subscriptions.push(copyInferredType, copyConstantObject);
}
