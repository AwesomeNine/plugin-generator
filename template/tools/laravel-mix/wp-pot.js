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
    const {output, file, domain, skipJS = false, exclude = [] } = this.config

	exclude.push(".github");
    exclude.push(".husky");
    exclude.push(".wordpress-org");
    exclude.push("node_modules");
    exclude.push("packages");
    exclude.push("tools");
    exclude.push("vendor");

	const rootPath = process.cwd()

    sh.exec(`wp i18n make-pot ${rootPath} ${rootPath}${output}${file} --domain=${domain} --exclude=${exclude.join(',')}`)
	if ( false !== skipJS ) {
    	sh.exec(`wp i18n make-json ${rootPath}${output}`, { silent: true })
	}
  }
}

mix.extend('wpPot', new WordPressPot())
