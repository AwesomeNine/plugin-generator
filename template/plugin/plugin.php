<?php
/**
 * {{company.name}}
 *
 * @package   {{misc.package}}
 * @author    {{author.name}} <{{author.email}}>
 * @link      {{company.url}}
 * @license   GPL-2.0+
 * @copyright Copyright (C) {{year}}, {{company.name}}.
 *
 * @wordpress-plugin
 * Plugin Name:       {{wp.name}}
 * Plugin URI:        {{company.url}}/{{wp.name}}
 * Description:       {{wp.description}}
 * Version:           {{wp.version}}
 * Author:            {{author.name}}
 * Author URI:        {{author.url}}
 * Text Domain:       {{wp.textDomain}}
 * Domain Path:       /languages
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @requires
 * Requires at least: {{wp.requireWP}}
 * Requires PHP:      {{wp.requirePHP}}
 */

// Early bail!!
if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( defined( '{{misc.constprefix}}_FILE' ) ) {
	return;
}

define( '{{misc.constprefix}}_FILE', __FILE__ );
define( '{{misc.constprefix}}_VERSION', '{{wp.version}}' );

// Load the autoloader.
require_once __DIR__ . '/includes/class-autoloader.php';
\{{misc.package}}\Autoloader::get()->initialize();

if ( ! function_exists( '{{misc.prefix}}' ) ) {
	/**
	 * Returns the main instance of {{wp.name}}.
	 *
	 * @since {{wp.version}}
	 *
	 * @return \{{misc.package}}\Plugin
	 */
	function {{misc.prefix}}() {
		return \{{misc.package}}\Plugin::get();
	}

	// Start it.
	{{misc.prefix}}();
}
