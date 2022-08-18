<?php
/**
 * An interface for registering integrations with WordPress.
 *
 * @package {{php.package}}
 * @author  {{author.name}} <{{author.email}}>
 * @since   {{version}}
 */

namespace {{php.package}}\Interfaces;

defined( 'ABSPATH' ) || exit;

/**
 * Integration interface.
 */
interface WordPress_Integration {

	/**
	 * Hook into WordPress.
	 */
	public function hooks();
}
