"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const hoverProvider_1 = require("./hoverProvider");
function activate(context) {
    console.log("Vue Code Order Hover extension is now active!");
    // Регистрируем hover provider для Vue файлов
    const hoverProvider = new hoverProvider_1.VueCodeOrderHoverProvider();
    const disposable = vscode.languages.registerHoverProvider({ scheme: "file", language: "vue" }, hoverProvider);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map