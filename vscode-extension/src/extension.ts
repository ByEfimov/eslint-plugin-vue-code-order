import * as vscode from "vscode";
import { VueCodeOrderHoverProvider } from "./hoverProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("Vue Code Order Hover extension is now active!");

  // Регистрируем hover provider для Vue файлов
  const hoverProvider = new VueCodeOrderHoverProvider();

  const disposable = vscode.languages.registerHoverProvider(
    { scheme: "file", language: "vue" },
    hoverProvider
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
