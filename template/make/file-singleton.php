<?php
/**
 * {{heading}}.
 *
 * @package {{php.package}}
 * @author  {{author.name}} <{{author.email}}>
 * @since   {{wp.version}}
 */

namespace {{php.package}}{{namespace}};

use {{php.package}}\Interfaces\WordPress_Integration;

defined( 'ABSPATH' ) || exit;

/**
 * {{heading}}.
 */
class {{className}} implements WordPress_Integration {

	/**
	 * Main instance
	 *
	 * Ensure only one instance is loaded or can be loaded.
	 *
	 * @return {{className}}
	 */
	public static function get() {
		static $instance;

		if ( null === $instance ) {
			$instance = new {{className}}();
		}

		return $instance;
	}

	/**
	 * Hook into WordPress.
	 */
	public function hooks() {
	}
}
