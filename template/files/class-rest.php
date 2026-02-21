<?php
/**
 * {{heading}}.
 * {{description}}
 *
 * @since   {{wp.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}{{namespace}};

use Awesome9\Framework\Interfaces\Routes_Interface;

defined( 'ABSPATH' ) || exit;

/**
 * {{className}} class.
 */
class {{className}} implements Routes_Interface {

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes(): void {

	}
}
