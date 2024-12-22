<?php
/**
 * The class is responsible for adding menu and submenu pages for the plugin in the WordPress admin area..
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}\Admin;

use Awesome9\Framework\Screens\Manager;
use Awesome9\Framework\Toolkit_Preview;

defined( 'ABSPATH' ) || exit;

/**
 * Screens class.
 */
class Screens extends Manager {

	/**
	 * Define the body class for the plugin.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function define_body_class(): string {
		return '{{functionName}}';
	}

	/**
	 * Define the hook prefix for the plugin.
	 *
	 * @return string
	 */
	protected function define_hook_prefix(): string {
		return '{{functionName}}';
	}

	/**
	 * Define the screens for the plugin.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function define_screens(): void {
		$this->add_screen( Pages\Dashboard::class );
		$this->add_screen( Pages\Settings::class );
		$this->add_screen( Toolkit_Preview::class );
	}

	/**
	 * Render tab content
	 *
	 * @param string $active Active tab.
	 * @param array  $tab    Tab object.
	 * @param array  $args   Arguments to be used in the template.
	 *
	 * @return void
	 */
	public function render_tab_content( $active, $tab, $args ): void {
		echo '<div class="awesome9-tab-content">';
		include $tab['filename'];
		echo '</div>';
	}

	/**
	 * Define the header view for the plugin.
	 *
	 * @return string
	 */
	public function define_header_view(): string {
		return {{functionName}}()->abspath . 'views/admin/header.php';
	}
}
