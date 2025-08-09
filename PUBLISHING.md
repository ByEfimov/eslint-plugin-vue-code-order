# Инструкция по публикации ESLint Plugin Vue Code Order

## Подготовка к публикации

### 1. Установка зависимостей

```bash
npm install
```

### 2. Сборка проекта

```bash
npm run build
```

### 3. Запуск тестов

```bash
npm test
```

### 4. Проверка линтера

```bash
npm run lint
```

## Публикация в NPM

### 1. Создание аккаунта в NPM

Если у вас нет аккаунта в NPM:

1. Перейдите на https://npmjs.com
2. Нажмите "Sign Up"
3. Заполните регистрационную форму
4. Подтвердите email

### 2. Логин в NPM CLI

```bash
npm login
```

Введите ваши данные:
- Username: ваш_username
- Password: ваш_пароль
- Email: ваш_email

### 3. Проверка имени пакета

Убедитесь, что имя пакета свободно:

```bash
npm view eslint-plugin-vue-code-order
```

Если пакет не найден - имя свободно.

### 4. Настройка package.json

Проверьте и обновите следующие поля в `package.json`:

```json
{
  "name": "eslint-plugin-vue-code-order",
  "version": "1.0.0",
  "description": "ESLint plugin for enforcing code order in Vue files",
  "author": "Ваше Имя <ваш@email.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/ваш_username/eslint-plugin-vue-code-order.git"
  },
  "bugs": {
    "url": "https://github.com/ваш_username/eslint-plugin-vue-code-order/issues"
  },
  "homepage": "https://github.com/ваш_username/eslint-plugin-vue-code-order#readme"
}
```

### 5. Создание GitHub репозитория

1. Создайте новый репозиторий на GitHub
2. Инициализируйте git в проекте:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ваш_username/eslint-plugin-vue-code-order.git
git branch -M main
git push -u origin main
```

### 6. Публикация

```bash
npm publish
```

### 7. Проверка публикации

Проверьте, что пакет опубликован:

```bash
npm view eslint-plugin-vue-code-order
```

## Обновление версии

### 1. Обновление версии

```bash
# Patch версия (1.0.0 -> 1.0.1)
npm version patch

# Minor версия (1.0.0 -> 1.1.0)
npm version minor

# Major версия (1.0.0 -> 2.0.0)
npm version major
```

### 2. Пуш изменений

```bash
git push origin main --tags
```

### 3. Публикация новой версии

```bash
npm publish
```

## Создание Release в GitHub

### 1. Перейдите в ваш репозиторий на GitHub

### 2. Создайте новый Release

1. Нажмите "Releases" → "Create a new release"
2. Выберите тег версии (например, v1.0.0)
3. Заполните название и описание
4. Нажмите "Publish release"

## Продвижение библиотеки

### 1. Создайте качественную документацию

- Подробный README
- Примеры использования
- API документация
- Changelog

### 2. Добавьте ключевые слова в package.json

```json
{
  "keywords": [
    "eslint",
    "eslintplugin",
    "vue",
    "vue3",
    "code-order",
    "formatting",
    "linting",
    "javascript",
    "typescript"
  ]
}
```

### 3. Добавьте badge'и в README

```markdown
[![npm version](https://badge.fury.io/js/eslint-plugin-vue-code-order.svg)](https://badge.fury.io/js/eslint-plugin-vue-code-order)
[![Downloads](https://img.shields.io/npm/dm/eslint-plugin-vue-code-order.svg)](https://npmjs.org/package/eslint-plugin-vue-code-order)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### 4. Поделитесь в сообществе

- Vue.js Discord/Telegram каналы
- Reddit r/vuejs
- Twitter с хештегами #vuejs #eslint
- Dev.to статья
- Medium статья

### 5. Создайте примеры использования

Создайте репозиторий с примерами:

```bash
mkdir eslint-plugin-vue-code-order-examples
cd eslint-plugin-vue-code-order-examples
npm init -y
npm install eslint-plugin-vue-code-order
```

## Поддержка и развитие

### 1. Настройте GitHub Issues

Создайте шаблоны для:
- Bug reports
- Feature requests
- Questions

### 2. Настройте автоматические тесты

Добавьте GitHub Actions для:
- Автоматических тестов
- Проверки линтера
- Автоматической публикации

### 3. Мониторинг

- Следите за issues и PR
- Отвечайте на вопросы
- Регулярно обновляйте зависимости

## Полезные команды

```bash
# Проверка синтаксиса package.json
npm pkg fix

# Проверка безопасности
npm audit

# Просмотр размера пакета
npm pack --dry-run

# Тестирование установки локально
npm pack
npm install eslint-plugin-vue-code-order-1.0.0.tgz
```
