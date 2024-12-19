<?php
/**
 * Plugin dashboard screen.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}\Admin\Pages;

use Awesome9\Framework\Screens\Screen;

defined( 'ABSPATH' ) || exit;

/**
 * Dashboard class.
 */
class Dashboard extends Screen {

	/**
	 * Screen unique id.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return 'dashboard';
	}

	/**
	 * Register screen into WordPress admin area.
	 *
	 * @return void
	 */
	public function register_screen(): void {
		add_menu_page(
			__( 'Dashboard', '{{wp.textDomain}}' ),
			__( 'Awesome Dashboard', '{{wp.textDomain}}' ),
			'manage_options',
			'{{wp.textDomain}}',
			[ $this, 'display' ],
			'',
			60
		);

		$hook = add_submenu_page(
			'{{wp.textDomain}}',
			__( 'Dashboard', '{{wp.textDomain}}' ),
			__( 'Dashboard', '{{wp.textDomain}}' ),
			'manage_options',
			'{{wp.textDomain}}',
			[ $this, 'display' ]
		);

		$this->set_hook( $hook );
	}

	/**
	 * Enqueue assets
	 *
	 * @return void
	 */
	public function enqueue_assets(): void {
	}

	/**
	 * Display screen content.
	 *
	 * @return void
	 */
	public function display(): void {
		echo 'Dashboard content';
	}
}
