# 🚀 Публикация в VS Code Marketplace

## Шаг 1: Создание аккаунта Publisher

1. **Перейдите на https://marketplace.visualstudio.com/manage**
2. **Войдите через Microsoft аккаунт** или создайте новый
3. **Создайте Publisher** с именем `byefimov` (если еще не создан)

## Шаг 2: Получение Personal Access Token

1. **Перейдите в Azure DevOps**: https://dev.azure.com/
2. **Создайте новую организацию** (если нет)
3. **User Settings → Personal Access Tokens**
4. **New Token** со следующими настройками:

   - **Name**: `vscode-marketplace`
   - **Organization**: `All accessible organizations`
   - **Expiration**: `Custom defined` (установите на 1 год)
   - **Scopes**: `Custom defined`
     - ✅ **Marketplace**: `Acquire`, `Manage`

5. **Скопируйте токен** (сохраните в безопасном месте!)

## Шаг 3: Логин через vsce

```bash
# Войдите в систему через vsce
vsce login byefimov

# Введите Personal Access Token когда попросит
```

## Шаг 4: Публикация расширения

```bash
# Убедитесь что все файлы готовы
npm run compile

# Опубликуйте расширение
vsce publish

# Или опубликуйте с указанием версии
vsce publish 0.1.0

# Или опубликуйте готовый VSIX файл
vsce publish vue-code-order-hover-0.1.0.vsix
```

## Шаг 5: Проверка публикации

1. **Перейдите на**: https://marketplace.visualstudio.com/items?itemName=byefimov.vue-code-order-hover
2. **Убедитесь что расширение отображается корректно**
3. **Проверьте что можно установить** через VS Code

## 🔄 Обновление расширения

Для обновления существующего расширения:

```bash
# Увеличьте версию в package.json
# "version": "0.1.1"

# Обновите CHANGELOG.md с изменениями

# Перекомпилируйте
npm run compile

# Опубликуйте новую версию
vsce publish
```

## ✅ Checklist перед публикацией

- [x] **README.md** - подробное описание с примерами
- [x] **package.json** - все поля заполнены корректно
- [x] **LICENSE** - MIT лицензия добавлена
- [x] **icon.png** - иконка расширения (128x128px)
- [x] **CHANGELOG.md** - история изменений
- [x] **Код скомпилирован** - `npm run compile` выполнен
- [x] **Тестирование** - расширение протестировано локально
- [x] **.vscodeignore** - исключены ненужные файлы

## 📋 Полезные команды vsce

```bash
# Показать информацию о пакете
vsce show byefimov.vue-code-order-hover

# Проверить пакет перед публикацией
vsce package --no-update-package-json

# Отменить публикацию (будьте осторожны!)
vsce unpublish byefimov.vue-code-order-hover

# Посмотреть список опубликованных расширений
vsce ls-publishers
```

## 🔗 Полезные ссылки

- **VS Code Marketplace**: https://marketplace.visualstudio.com/manage
- **Azure DevOps**: https://dev.azure.com/
- **vsce документация**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **Руководство по публикации**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## 🎯 После публикации

1. **Поделитесь ссылкой** в соцсетях и сообществах Vue.js
2. **Добавьте бейдж** в README основного проекта:

   ```markdown
   [![VS Code Extension](https://img.shields.io/visual-studio-marketplace/v/byefimov.vue-code-order-hover)](https://marketplace.visualstudio.com/items?itemName=byefimov.vue-code-order-hover)
   ```

3. **Создайте GitHub Release** с VSIX файлом
4. **Обновите документацию** основного проекта

Удачи с публикацией! 🚀
