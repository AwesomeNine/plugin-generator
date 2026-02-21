<?php
/**
* The class provides plugin uninstallation routines.
 *
 * @since   {{wp.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}\Installation;

use Awesome9\Framework\Interfaces\Initializer_Interface;

defined( 'ABSPATH' ) || exit;

/**
 * Uninstall class.
 */
class Uninstall implements Initializer_Interface {

	/**
	 * Runs this initializer.
	 *
	 * @return void
	 */
	public function initialize(): void {
		if ( ! is_multisite() ) {
			$this->uninstall();
			return;
		}

		$site_ids = Install::get_sites();

		if ( empty( $site_ids ) ) {
			return;
		}

		foreach ( $site_ids as $site_id ) {
			switch_to_blog( $site_id );
			$this->uninstall();
			restore_current_blog();
		}
	}

	/**
	 * Fired for each blog when the plugin is uninstalled.
	 *
	 * @return void
	 */
	private function uninstall(): void { // phpcs:ignore Universal.CodeAnalysis.ConstructorDestructorReturn.ReturnTypeFound
		$this->delete_options();

		wp_cache_flush();
	}

	/**
	 * Delete options.
	 *
	 * @return void
	 */
	private function delete_options(): void {
	}
}
