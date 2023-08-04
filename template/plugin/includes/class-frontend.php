<?php
/**
 * Frontend.
 *
 * @package {{php.package}}
 * @author  {{author.name}} <{{author.email}}>
 * @since   {{wp.version}}
 */

namespace {{php.package}}{{namespace}};

use {{php.package}}\Interfaces\WordPress_Integration;

defined( 'ABSPATH' ) || exit;

/**
 * Frontend.
 */
class Frontend implements WordPress_Integration {

	/**
	 * Hook into WordPress.
	 */
	public function hooks() {
	}
}
