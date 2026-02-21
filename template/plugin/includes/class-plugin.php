<?php
/**
 * The plugin bootstrap.
 *
 * @since   {{wp.version}}
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
		return {{misc.constprefix}}_VERSION;
	}

	/**
	 * Bootstrap plugin.
	 *
	 * @return void
	 */
	private function setup(): void {
		$this->define_constants();
		$this->includes_functions();
		$this->includes_common();
		$this->includes_rest();
		$this->includes_admin();
		$this->includes_frontend();

		add_action( 'plugins_loaded', [ $this, 'on_plugins_loaded' ], -1 );

		// Load it all.
		$this->load();
	}

	/**
	 * When WordPress has loaded all plugins, trigger the `{{misc.prefix}}-loaded` hook.
	 *
	 * @since {{wp.version}}
	 *
	 * @return void
	 */
	public function on_plugins_loaded(): void {
		/**
		 * Action trigger after loading finished.
		 *
		 * @since {{wp.version}}
		 */
		do_action( '{{misc.prefix}}-loaded' );
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
		$this->register_integration( Assets_Registry::class, 'registry' );
		$this->register_integration( Framework\JSON::class, 'json', [ '{{misc.prefix}}' ] );
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
	private function define_constants(): void {
		$this->define( '{{misc.constprefix}}_ABSPATH', dirname( {{misc.constprefix}}_FILE ) . '/' );
		$this->define( '{{misc.constprefix}}_BASE_URL', plugin_dir_url( {{misc.constprefix}}_FILE ) );
		$this->define( '{{misc.constprefix}}_PLUGIN_BASENAME', plugin_basename( {{misc.constprefix}}_FILE ) );
	}
}
