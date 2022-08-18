<?php
/**
 * Plugin loader.
 *
 * @package {{php.package}}
 * @author  {{author.name}} <{{author.email}}>
 * @since   {{version}}
 */

namespace {{php.package}};

defined( 'ABSPATH' ) || exit;

/**
 * Plugin Loader.
 */
class Plugin {

	/**
	 * Main instance
	 *
	 * Ensure only one instance is loaded or can be loaded.
	 *
	 * @return Plugin
	 */
	public static function get() {
		static $instance;

		if ( is_null( $instance ) ) {
			$instance = new Plugin();
		}

		return $instance;
	}

	/**
	 * Set plugin paths.
	 *
	 * @param  string $file File.
	 * @return Plugin
	 */
	public function set_paths( $file ) {
		$this->path     = dirname( $file ) . '/';
		$this->url      = plugins_url( '', $file ) . '/';
		$this->rel_path = dirname( plugin_basename( $file ) );

		return $this;
	}

	/**
	 * Instantiate the plugin.
	 *
	 * @return Plugin
	 */
	public function hooks() {
		// Admin Only.
		if ( is_admin() ) {
		}

		// Frontend.
		if ( ! is_admin() ) {
		}

		// Common.
		( new Assets() )->hooks();

		add_action( 'init', [ $this, 'load_textdomain' ] );
		add_filter( 'acf/settings/load_json', [ $this, 'add_acf_path' ] );

		return $this;
	}

	/**
	 * Setup internationlization.
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'{{wp.textDomain}}',
			false,
			$this->rel_path . '/languages'
		);
	}

	/**
	 * Add ACF json path.
	 *
	 * @param  array $paths Array of json paths.
	 * @return array
	 */
	public function add_acf_path( $paths ) {
		$paths[] = $this->path . 'assets/acf-json';

		return $paths;
	}
}
