<?php
/**
 * The plugin bootstrap.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}};

use Awesome9\Framework;
use {{misc.package}}\Installation\Install;

defined( 'ABSPATH' ) || exit;

/**
 * Plugin Loader.
 *
 *  * Containers:
 *
 * @property Assets_Registry $registry Assets registry.
 * @property Framework\JSON  $json     JSON handler.
 */
class Plugin extends Framework\Loader {

	/**
	 * Plugin absolute path
	 *
	 * @var string
	 */
	public $abspath = null;

	/**
	 * Plugin url
	 *
	 * @var string
	 */
	public $baseurl = null;

	/**
	 * Plugin basename
	 *
	 * @var string
	 */
	public $basename = null;

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
			$instance->setup();
		}

		return $instance;
	}

	/**
	 * Get plugin version
	 *
	 * @return string
	 */
	public function get_version(): string {
		return {{wp.shortname}}_VERSION;
	}

	/**
	 * Bootstrap plugin.
	 *
	 * @return void
	 */
	private function setup(): void {
		$this->set_paths();
		$this->includes_functions();
		$this->includes_common();
		$this->includes_rest();
		$this->includes_admin();
		$this->includes_frontend();

		add_action( 'init', [ $this, 'load_textdomain' ] );
		add_action( 'plugins_loaded', [ $this, 'on_plugins_loaded' ], -1 );

		// Load it all.
		$this->load();
	}

	/**
	 * When WordPress has loaded all plugins, trigger the `{{functionName}}-loaded` hook.
	 *
	 * @since 1.47.0
	 *
	 * @return void
	 */
	public function on_plugins_loaded(): void {
		/**
		 * Action trigger after loading finished.
		 *
		 * @since 1.47.0
		 */
		do_action( '{{functionName}}-loaded' );
	}

	/**
	 * Setup internationlization.
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'{{wp.textDomain}}',
			false,
			$this->basename . '/languages'
		);
	}

	/**
	 * Includes the necessary functions files.
	 *
	 * @return void
	 */
	private function includes_functions(): void {}

	/**
	 * Includes core files used in admin and on the frontend.
	 *
	 * @return void
	 */
	private function includes_common(): void {
		$this->register_initializer( Install::class );
		$this->register_integration( Entities::class );
		$this->register_integration( Assets_Registry::class, 'registry' );
		$this->register_integration( Framework\JSON::class, 'json', [ '{{functionName}}' ] );
	}

	/**
	 * Includes rest api files used in admin and on the frontend.
	 *
	 * @return void
	 */
	private function includes_rest(): void {}

	/**
	 * Includes files used in admin.
	 *
	 * @return void
	 */
	private function includes_admin(): void {
		// Early bail!!
		if ( ! is_admin() ) {
			return;
		}

		$this->register_initializer( Upgrades::class );
		$this->register_integration( Admin\Admin::class );
	}

	/**
	 * Includes files used on the frontend.
	 *
	 * @return void
	 */
	private function includes_frontend(): void {
		// Early bail!!
		if ( is_admin() ) {
			return;
		}
	}

	/**
	 * Set plugin paths.
	 *
	 * @return Plugin
	 */
	private function set_paths() {
		$this->abspath  = dirname( {{wp.shortname}}_FILE ) . '/';
		$this->baseurl  = plugin_dir_url( {{wp.shortname}}_FILE );
		$this->basename = plugin_basename( {{wp.shortname}}_FILE );

		return $this;
	}
}
