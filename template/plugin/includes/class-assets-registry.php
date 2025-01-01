<?php
/**
 * Assets registry handles the registration of stylesheets and scripts required for plugin functionality.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}};

use Awesome9\Framework;

defined( 'ABSPATH' ) || exit;

/**
 * Assets Registry.
 */
class Assets_Registry extends Framework\Assets_Registry {

	/**
	 * Version for plugin local assets.
	 *
	 * @return string
	 */
	public function get_version(): string {
		return {{wp.shortname}}_VERSION;
	}

	/**
	 * Prefix to use in handle to make it unique.
	 *
	 * @return string
	 */
	public function get_prefix(): string {
		return '{{wp.textDomain}}';
	}

	/**
	 * Base URL for plugin local assets.
	 *
	 * @return string
	 */
	public function get_base_url(): string {
		return {{functionName}}()->baseurl;
	}

	/**
	 * Register styles
	 *
	 * @return void
	 */
	public function register_styles(): void {
		wp_register_style( 'ui-toolkit', {{functionName}}()->baseurl . 'assets/css/ui-toolkit.css', [], $this->get_version() );
	}

	/**
	 * Register scripts
	 *
	 * @return void
	 */
	public function register_scripts(): void {
		$runtime = $this->get_dependencies( 'runtime' );
		if ( isset( $runtime['dependencies'] ) ) {
			$this->register_script( 'runtime', schema9()->baseurl . 'assets/dist/runtime.js', [], $this->get_version(), true );
		}
	}

	/**
	 * Get dependencies for a handle.
	 *
	 * @param string $handle Handle of the script.
	 *
	 * @return array
	 */
	private function get_dependencies( $handle ): array {
		$dependencies = [];
		$asset_file   = schema9()->abspath . 'assets/dist/' . $handle . '.asset.php';

		if ( file_exists( $asset_file ) ) {
			$dependencies = include $asset_file;
		}

		return $dependencies;
	}
}
