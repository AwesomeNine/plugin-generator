<?php
/**
 * Frontend template file.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}\Frontend;

use Awesome9\Framework\Interfaces\Integration_Interface;

defined( 'ABSPATH' ) || exit;

/**
 * Frontend class.
 */
class Frontend implements Integration_Interface {

	/**
	 * Hook into WordPress.
	 *
	 * @return void
	 */
	public function hooks(): void {

	}
}
