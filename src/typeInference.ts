import * as ts from "typescript";
import * as vscode from "vscode";
import * as path from "path";
import { findProjectRoot, getAllTypeScriptFiles } from "./fileUtils";

export async function getInferredType(
  document: vscode.TextDocument,
  position: vscode.Position
): Promise<string | null> {
  try {
    const fileName = document.fileName;
    const projectRoot = findProjectRoot(fileName);
    const tsconfigPath = ts.findConfigFile(
      projectRoot,
      ts.sys.fileExists,
      "tsconfig.json"
    );
    let compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      allowJs: true,
      checkJs: true,
    };

    if (tsconfigPath) {
      const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
      const parsedConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path.dirname(tsconfigPath)
      );
      compilerOptions = { ...compilerOptions, ...parsedConfig.options };
    }

    const projectFiles = getAllTypeScriptFiles(projectRoot);
    const program = ts.createProgram(projectFiles, compilerOptions);
    const sourceFile = program.getSourceFile(fileName);
    const typeChecker = program.getTypeChecker();

    if (!sourceFile) {
      return null;
    }

    const offset = document.offsetAt(position);
    const nodeAtPosition = findNodeAtPosition(sourceFile, offset);

    if (nodeAtPosition) {
      let typeNode: ts.Node | undefined = nodeAtPosition;

      if (ts.isExpressionStatement(nodeAtPosition)) {
        typeNode = nodeAtPosition.expression;
      }

      if (ts.isVariableDeclaration(typeNode) && typeNode.initializer) {
        typeNode = typeNode.initializer;
      }

      const type = typeChecker.getTypeAtLocation(typeNode);
      return formatType(type, typeChecker);
    }

    return null;
  } catch (error) {
    console.error("Error in getInferredType:", error);
    return null;
  }
}

function findNodeAtPosition(
  sourceFile: ts.SourceFile,
  offset: number
): ts.Node | undefined {
  function find(node: ts.Node): ts.Node | undefined {
    if (node.getStart() <= offset && offset < node.getEnd()) {
      const childNode = ts.forEachChild(node, find);
      return childNode || node;
    }
  }
  return find(sourceFile);
}

function formatType(type: ts.Type, typeChecker: ts.TypeChecker): string {
  if (type.isUnion()) {
    return type.types.map((t) => formatType(t, typeChecker)).join(" | ");
  }

  if (type.isIntersection()) {
    return type.types.map((t) => formatType(t, typeChecker)).join(" & ");
  }

  if (type.isClassOrInterface()) {
    const props = type.getProperties().map((prop) => {
      const propType = typeChecker.getTypeOfSymbolAtLocation(
        prop,
        prop.valueDeclaration!
      );
      const isOptional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
      return `${prop.name}${isOptional ? "?" : ""}: ${formatType(
        propType,
        typeChecker
      )}`;
    });
    return `{ ${props.join("; ")} }`;
  }

  return typeChecker.typeToString(
    type,
    undefined,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.WriteArrayAsGenericType |
      ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
      ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
      ts.TypeFormatFlags.InTypeAlias
  );
}
