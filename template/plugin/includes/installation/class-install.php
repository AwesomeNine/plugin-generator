<?php
/**
* The class provides plugin installation routines.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}\Installation;

use Awesome9\Framework\Installation\Install as Base;

defined( 'ABSPATH' ) || exit;

/**
 * Install.
 */
class Install extends Base {

	/**
	 * Plugin base file
	 *
	 * @var string
	 */
	protected function get_base_file(): string {
		return {{wp.shortname}}_FILE;
	}

	/**
	 * Plugin activation callback.
	 *
	 * @return void
	 */
	protected function activate(): void {
	}

	/**
	 * Plugin deactivation callback.
	 *
	 * @return void
	 */
	protected function deactivate(): void {
	}

	/**
	 * Plugin uninstall callback.
	 *
	 * @return void
	 */
	public static function uninstall(): void {
		( new Uninstall() )->initialize();
	}
}
