<?php
/**
 * {{heading}}.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}{{namespace}};

defined( 'ABSPATH' ) || exit;

/**
 * {{className}} class.
 */
class {{className}} {

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
}
