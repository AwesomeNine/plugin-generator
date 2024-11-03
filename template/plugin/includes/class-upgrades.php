<?php
/**
 * Upgrades.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}};

use Awesome9\Framework\Updates;
use Awesome9\Framework\Interfaces\Initializer_Interface;

defined( 'ABSPATH' ) || exit;

/**
 * Upgrades class.
 */
class Upgrades extends Updates implements Initializer_Interface {

	const DB_VERSION = '{{product.version}}';

	/**
	 * Get updates that need to run.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_updates(): array {
		return [];
	}

	/**
	 * Get folder path
	 *
	 * @since  1.0.0
	 *
	 * @return string
	 */
	public function get_folder(): string {
		return {{functionName}}()->abspath . '{{paths.updates}}/';
	}

	/**
	 * Get plugin version number
	 *
	 * @since  1.0.0
	 *
	 * @return string
	 */
	public function get_version(): string {
		return self::DB_VERSION;
	}

	/**
	 * Get plugin option name.
	 *
	 * @since  1.0.0
	 *
	 * @return string
	 */
	public function get_option_name(): string {
		return '{{wp.upgradeOptionName}}';
	}

	/**
	 * Runs this initializer.
	 *
	 * @return void
	 */
	public function initialize(): void {
		// Force run the upgrades.
		$is_first_time = empty( $this->get_installed_version() );
		$this->hooks();

		if ( $is_first_time ) {
			update_option( $this->get_option_name(), '1.0.0' );
			add_action( 'admin_init', [ $this, 'perform_updates' ] );
		}
	}
}
