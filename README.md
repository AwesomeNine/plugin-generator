# WordPress Scaffolding

[![NPM](https://img.shields.io/npm/v/wp-awesome9.svg)](https://www.npmjs.com/package/wp-awesome9) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
	<img src="https://img.icons8.com/nolan/256/wordpress.png"/>
</p>

## 📃 Introduction

Quickly bootstrap your next awesome WordPress plugin with just one command!

With WP-Awesome9, developers can quickly initialize project configurations, manage plugin versions, create new plugins, and generate WordPress-compatible classes, views, and other essential files.

##  Features
- **Automated Configurations**: Easily initialize a new project configuration.
- **Version Management**: Update plugin versions seamlessly.
- **File and Plugin Generation**: Quickly create plugins, classes, views, JavaScript, and CSS files.
- **Flexible Templates**: Choose from various templates to scaffold files suited to your specific requirements.
- **Efficient Updates**: Generate updates as you iterate through plugin development.

## 🕹 Usage

```bash
  wp-awesome9 <command> [options]
```

### Commands

#### `init`
Creates a new configuration file for your WordPress project.

```bash
  wp-awesome9 init
```

#### `version <version>`
Updates the plugin version to the specified version. Accepts either a version number (e.g., `1.2.3`) or a version type (`major`, `minor`, `patch`).

- **Arguments:**
  - `<version>`: The version you want to update

```bash
  wp-awesome9 version 1.2.3
  wp-awesome9 version major
```

#### `plugin`
Creates a new plugin template with the essential WordPress setup.

```bash
  wp-awesome9 plugin
```

#### `class <classname> [heading] [options]`
Generates a new PHP class file with template options for customization.

- **Arguments:**
  - `classname`: The name of the class to create.
  - `heading`: Adds a heading comment to the class file (optional).
- **Options:**
  - `-i`: Creates a class with an initializer interface template.
  - `-g`: Creates a class with an integration interface template.
  - `-r`: Creates a class with a REST interface template.
  - `-s`: Creates a class with a singleton template.

```bash
  wp-awesome9 class MyNewClass "My Custom Class"
```

#### `view <viewname> [heading]`
Creates a new view file for rendering content.
- **Arguments:**
  - `viewname`: The name of the view file.
  - `heading`: Adds a heading comment to the view file (optional).

```bash
  wp-awesome9 view my-view "My Custom View"
```

#### `js <filename> [heading] [options]`
Creates a new JavaScript file with options for integration with Webpack.

- **Arguments:**
  - `filename`: The name of the JavaScript file.
  - `heading`: Adds a heading comment to the file (optional).
- **Options:**
  - `-w`: Adds the file to the Webpack mix file for processing (TODO).

```bash
  wp-awesome9 js main "Main JavaScript File" -w
```

#### `css <filename> [heading] [options]`
Generates a new CSS file with options for integration with Webpack.

- **Arguments:**
  - `filename`: The name of the CSS file.
  - `heading`: Adds a heading comment to the file (optional).
- **Options:**
  - `-w`: Adds the file to the Webpack mix file for processing (TODO).

```bash
  wp-awesome9 css styles "Plugin Stylesheet" -w
```

#### `updates <version>`
Generates an update entry for the plugin with the specified version.

```bash
  wp-awesome9 updates 1.2.3
```

## 📖 Changelog

[See the changelog file](./CHANGELOG.md)
