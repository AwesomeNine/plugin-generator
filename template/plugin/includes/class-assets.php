<?php
/**
 * Assets.
 *
 * @package {{php.package}}
 * @author  {{author.name}} <{{author.email}}>
 * @since   {{wp.version}}
 */

namespace {{php.package}};

use {{php.package}}\Interfaces\WordPress_Integration;

defined( 'ABSPATH' ) || exit;

/**
 * Assets.
 */
class Assets implements WordPress_Integration {

	/**
	 * Hook into WordPress.
	 */
	public function hooks() {
		add_action( 'wp_enqueue_scripts', [ $this, 'register' ], 1 );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue' ] );
	}

	/**
	 * Register assets.
	 *
	 * @return void
	 */
	public function register() {
		$theme_uri     = get_template_directory_uri();
		$theme_version = wp_get_theme()->get( 'Version' );

		// Google Fonts.
		wp_register_style(
			'google-fonts',
			'//fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap',
			null,
			'2'
		);
	}

	/**
	 * Enqueue
	 */
	public function enqueue() {
		$theme_version = wp_get_theme()->get( 'Version' );

		$deps_css = [
			'google-fonts',
		];
		$deps_js  = [
			'jquery',
		];

		// App.
		wp_enqueue_style(
			'theme',
			{{functionName}}()->url . '/assets/css/app.css',
			$deps_css,
			$theme_version
		);
		wp_enqueue_script(
			'app',
			{{functionName}}()->url . '/assets/js/app.js',
			$deps_js,
			$theme_version,
			true
		);
	}
}
