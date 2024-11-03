<?php
/**
 * The class handles the registration of custom post types and taxonomies in the plugin.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}};

use Awesome9\Framework\Interfaces\Integration_Interface;

defined( 'ABSPATH' ) || exit;

/**
 * Entities class.
 */
class Entities implements Integration_Interface {

	/**
	 * Hook into WordPress.
	 *
	 * @return void
	 */
	public function hooks(): void {
		$this->register_post_types();
		$this->register_taxonomies();
	}

	/**
	 * Register post types.
	 *
	 * @return void
	 */
	private function register_post_types(): void {}

	/**
	 * Register taxonomies.
	 *
	 * @return void
	 */
	private function register_taxonomies(): void {}
}
