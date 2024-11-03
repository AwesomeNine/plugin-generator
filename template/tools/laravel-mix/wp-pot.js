const mix = require('laravel-mix')

class WordPressPot {
  name() {
    return 'wpPot'
  }

  dependencies() {
    this.requiresReload = `
      Dependencies have been installed. Please run again.
    `
    return ['shelljs']
  }

  register(config) {
    this.config = config
  }

  boot() {
    const sh = require('shelljs')
    const {
		output,
		file,
		domain,
		skipJS = false,
		exclude = [],
		headers = {
			'Last-Translator': '{{author.name}} <{{author.email}}>',
			'Language-Team': '{{product.name}} <{{author.email}}>',
		},
	} = this.config;

	exclude.push(".github");
    exclude.push(".husky");
    exclude.push(".wordpress-org");
    exclude.push("node_modules");
    exclude.push("packages");
    exclude.push("tools");
    exclude.push("vendor");

	const rootPath = process.cwd()
	const command = [
		'wp i18n make-pot',
		rootPath,
		rootPath + output + file,
		`--domain=${domain}`,
		`--exclude=${exclude.join(',')}`,
		`--headers='${JSON.stringify(headers)}'`,
	];

	sh.exec(command.join(' '));

	if ( false !== skipJS ) {
    	sh.exec(`wp i18n make-json ${rootPath}${output}`, { silent: true })
	}
  }
}

mix.extend('wpPot', new WordPressPot())
