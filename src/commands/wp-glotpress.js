/**
 * External Dependencies
 */
import fs from 'fs';
import chalk from 'chalk';
import { resolve } from 'path';
import eachSeries from 'async/eachSeries.js';

/**
 * Internal Dependencies
 */
import { heading, msgError, getSetting, write, msgSuccessOnSameLine, onSameLine, msgErrorOnSameLine } from "../utilities/index.js";

class GlotPressDownloader {
    baseURL = 'https://translate.awesome9.co/api/projects';

    run() {
        heading('Downloading Translations from GlotPress...')

        try {
            this.validateData();
            this.maybeDirectory();
			this.download();
        } catch (error) {
            msgError(error.message);
            return;
        }
    }

    validateData() {
        const glotpress = getSetting('glotpress')
        write('Validating data...');

        if (!glotpress) {
            onSameLine('')
            throw new Error('No glotpress project found');
        }

		if ('' === glotpress.project) {
			throw new Error('The GlotPress project name is not defined.');
		}

		if (undefined === glotpress.destination || '' === glotpress.destination) {
			throw new Error('The destination directory is not defined.');
		}

		// Set data.
		const { project, destination } = glotpress;
		const domain = getSetting('wpPot.domain');

		this.project = project;
		this.potPrefix = domain ?? project;
		this.destination = destination;

        msgSuccessOnSameLine('Validation done');
	}

    maybeDirectory() {
		const destination = resolve(this.destination);
        write('Checking if destination directory exists...');

		if (!fs.existsSync(destination)) {
			fs.mkdirSync(destination);

            if (!fs.existsSync(destination)) {
                throw new Error('The destination directory could not be created.');
            } else {
                msgSuccessOnSameLine('Directory created');
            }
		} else {
            msgSuccessOnSameLine('Directory exists');
        }
	}

    async download() {
        const locales = await this.getLocales();
        if (false === locales) {
			return;
		}

        eachSeries(
            Object.keys(locales),
            (locale, callback) => {
                const set = locales[locale];

                console.log('');
				console.log(
					chalk.yellow.bold('Updating Language:') +
						` ${chalk.italic(set.name)}`
				);

                eachSeries(['mo', 'po'], (format, nextFormat) => {
                    this.downloadFile(locale, set, format, nextFormat);
                }, (err) => {
                    callback();
                })
            },
            (err, results) => {
                if (err) {
                    msgError(err.message);
                } else {
                    console.log('');
                    console.log(
                        chalk.bgGreen.bold('Success:') +
                            ' All files has been downloaded.'
                    );
                }
            }
        )
    }

    async getLocales() {
        write('Downloading locales...');
        const response = await fetch(`${this.baseURL}/${this.project}`);
        const data = await response.json();
        const sets = {};

		if (undefined !== data.success && !data.success) {
			msgErrorOnSameLine(data.error);
			return false;
		}

        data.translation_sets.map((set) => {
			if (set.current_count > 0) {
				let id = set.wp_locale;
				if ('default' !== set.slug) {
					id += '_' + set.slug;
				}

				sets[id] = set;
			}

			return false;
		});

        msgSuccessOnSameLine('Downloaded locales');

		return sets;
    }

   async downloadFile(locale, data, format, callback) {
		write(
			chalk.bold(`Downloading: ${this.potPrefix}-${locale}.${format}`)
		);

		const target = `${this.destination}/${this.potPrefix}-${locale}.${format}`;
		const endpoint = `${this.baseURL}/${this.project}/${data.locale}/${data.slug}/export-translations?format=${format}`;

		// Download.
		const response = await fetch(endpoint);
		const content = await response.text();

		fs.writeFileSync(target, content);

        onSameLine(
			chalk.bold(`Downloaded: ${this.potPrefix}-${locale}.${format}`)
		);

        callback();
	}
}

export default () => {
    const downloader = new GlotPressDownloader();
    downloader.run();
}
