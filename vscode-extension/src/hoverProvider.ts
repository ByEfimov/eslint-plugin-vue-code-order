import * as vscode from "vscode";
import { getCategoryForFunction } from "./categoryDetector";

export class VueCodeOrderHoverProvider implements vscode.HoverProvider {
  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    // Проверяем настройки
    const config = vscode.workspace.getConfiguration("vueCodeOrderHover");
    if (!config.get("enabled", true)) {
      return undefined;
    }

    // Проверяем, находимся ли мы в script setup блоке
    if (!this.isInScriptSetupBlock(document, position)) {
      return undefined;
    }

    // Получаем слово под курсором
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return undefined;
    }

    const word = document.getText(wordRange);

    // Получаем контекст строки для лучшего анализа
    const line = document.lineAt(position.line);
    const lineText = line.text;

    // Анализируем категорию функции
    const category = getCategoryForFunction(word, lineText);
    if (!category) {
      return undefined;
    }

    // Создаем содержимое hover'а
    const showDescription = config.get("showDescription", true);
    let hoverContent = `**Vue Code Order Category:** \`${category.name}\``;

    if (showDescription && category.description) {
      hoverContent += `\n\n${category.description}`;
    }

    // Добавляем информацию о порядке
    if (category.order !== undefined) {
      hoverContent += `\n\n*Order position: ${category.order + 1}*`;
    }

    const markdown = new vscode.MarkdownString(hoverContent);
    markdown.isTrusted = true;

    return new vscode.Hover(markdown, wordRange);
  }

  private isInScriptSetupBlock(
    document: vscode.TextDocument,
    position: vscode.Position
  ): boolean {
    const text = document.getText();
    const offset = document.offsetAt(position);

    // Ищем ближайший script setup блок
    const scriptSetupRegex = /<script\s+setup[^>]*>/gi;
    const scriptEndRegex = /<\/script>/gi;

    let match;
    let isInScriptSetup = false;

    // Сбрасываем regex
    scriptSetupRegex.lastIndex = 0;
    scriptEndRegex.lastIndex = 0;

    while ((match = scriptSetupRegex.exec(text)) !== null) {
      const startOffset = match.index + match[0].length;

      // Ищем соответствующий закрывающий тег
      scriptEndRegex.lastIndex = startOffset;
      const endMatch = scriptEndRegex.exec(text);

      if (endMatch) {
        const endOffset = endMatch.index;

        if (offset >= startOffset && offset <= endOffset) {
          isInScriptSetup = true;
          break;
        }
      }
    }

    return isInScriptSetup;
  }
}
