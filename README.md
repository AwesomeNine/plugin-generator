# WordPress Scaffolding

[![NPM](https://img.shields.io/npm/v/wp-awesome9.svg)](https://www.npmjs.com/package/wp-awesome9) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
	<img src="https://img.icons8.com/nolan/256/wordpress.png"/>
</p>

## 📃 Introduction

Quickly bootstrap your next awesome WordPress plugin with just one command!

## 💾 Installation

```js
  npx wp-awesome9
```

## 🕹 Usage

Run `wp-awesome9` command in your terminal and answer the questions and boom, it will auto-magically generate a WordPress plugin for you without stress!

```js
  npx wp-awesome9
  npx wp-awesome9 --folder=my-awesome-plugin
```

Create files
```js
  npx wp-awesome9 make:file --file="Dashboard"
  npx wp-awesome9 make:file --file="Admin\Report\Dashboard"
  npx wp-awesome9 make:file --file="Admin\Report\Dashboard" --singleton
```

1. This one generate a file named `class-dashboard.php` in `includes` folder with namespace `${rootNamespace}`.
2. This one generate a file name `class-dashboard.php` in `includes/admin/report` folder with namespace `${rootNamespace}\Admin\Report`.

## 📖 Changelog

[See the changelog file](./CHANGELOG.md)
