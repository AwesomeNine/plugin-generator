<?php // @codingStandardsIgnoreFile
/**
 * Plugin Name:       {{wp.name}}
 * Plugin URI:        {{company.url}}/{{package.name}}
 * Description:       {{wp.description}}
 * Version:           {{version}}
 * Author:            {{author.name}}
 * Author URI:        {{author.url}}
 * Text Domain:       {{wp.textDomain}}
 * Domain Path:       /languages
 * Requires at least: 5.5
 * Requires PHP: 7.0
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package    {{php.package}}
 * @copyright  Copyright (C) {{year}}, {{company.name}}.
 * @author     {{author.name}} <{{author.email}}>
 * @since      {{version}}
 */

defined( 'ABSPATH' ) || exit;

require_once 'vendor/autoload.php';

\{{php.package}}\Plugin::get()
	->set_paths( __FILE__ )
	->hooks();

/**
 * Helper function
 *
 * @return Plugin
 */
function nhg_change_me() {
	return \{{php.package}}\Plugin::get();
}
