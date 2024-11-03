<?php
/**
 * {{product.name}}
 *
 * @package   {{misc.package}}
 * @author    {{author.name}} <{{author.email}}>
 * @link      {{product.uri}}
 * @license   GPL-2.0+
 * @copyright Copyright (C) {{year}}, {{product.name}}.
 *
 * @wordpress-plugin
 * Plugin Name:       {{product.name}}
 * Plugin URI:        {{product.uri}}/{{package.name}}
 * Description:       {{product.description}}
 * Version:           {{product.version}}
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

if ( defined( '{{wp.shortname}}_FILE' ) ) {
	return;
}

define( '{{wp.shortname}}_FILE', __FILE__ );
define( '{{wp.shortname}}_VERSION', '{{product.version}}' );

// Load the autoloader.
require_once __DIR__ . '/includes/class-autoloader.php';
\{{misc.package}}\Autoloader::get()->initialize();

/**
 * Returns the main instance of {{product.name}}.
 *
 * @since {{product.version}}
 *
 * @return \{{misc.package}}\Plugin
 */
function {{functionName}}() {
	return \{{misc.package}}\Plugin::get();
}

// Start it.
{{functionName}}();
