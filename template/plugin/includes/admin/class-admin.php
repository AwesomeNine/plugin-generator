<?php
/**
 * Admin.
 *
 * @package {{php.package}}
 * @author  {{author.name}} <{{author.email}}>
 * @since   {{wp.version}}
 */

namespace {{php.package}}\Admin;

use {{php.package}}\Interfaces\WordPress_Integration;

defined( 'ABSPATH' ) || exit;

/**
 * Admin.
 */
class Admin implements WordPress_Integration {

	/**
	 * Hook into WordPress.
	 */
	public function hooks() {
	}
}
