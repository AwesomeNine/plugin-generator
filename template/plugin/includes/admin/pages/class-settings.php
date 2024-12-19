<?php
/**
 * Plugin settings screen.
 *
 * @since   {{product.version}}
 * @package {{misc.package}}
 * @author  {{author.name}} <{{author.email}}>
 */

namespace {{misc.package}}\Admin\Pages;

use Awesome9\Framework\Settings\Settings as Base;

defined( 'ABSPATH' ) || exit;

/**
 * Settings class.
 */
class Settings extends Base {

	/**
	 * Screen unique id.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return 'settings';
	}

	/**
	 * Get the option name.
	 *
	 * @return string
	 */
	public function get_option_name(): string {
		return '{{functionName}}_settings';
	}

	/**
	 * Register screen into WordPress admin area.
	 *
	 * @return void
	 */
	public function register_screen(): void {
		$hook = add_submenu_page(
			'{{wp.textDomain}}',
			__( 'Settings', '{{wp.textDomain}}' ),
			__( 'Settings', '{{wp.textDomain}}' ),
			'manage_options',
			'{{wp.textDomain}}-settings',
			[ $this, 'display' ]
		);

		$this->set_hook( $hook );
		parent::register_screen();
	}

	/**
	 * Enqueue assets
	 *
	 * @return void
	 */
	public function enqueue_assets(): void {
		wp_enqueue_style( 'ui-toolkit' );
	}

	/**
	 * Get page header arguments
	 *
	 * @return array
	 */
	public function define_header_args(): array {
		return [
			'breadcrumb' => false,
		];
	}

	/**
	 * Runs this initializer.
	 *
	 * @return void
	 */
	public function register_options(): void {
		$tab = $this->add_tab(
			[
				'id'    => 'general',
				'title' => __( 'General', '{{wp.textDomain}}' ),
				'icon'  => 'dashicons dashicons-admin-site',
			]
		);

		$tab->add_section(
			[
				'id'       => 'main',
				'title'    => __( 'General', '{{wp.textDomain}}' ),
				'template' => 'merged',
			]
		)
			->add_field(
				[
					'id'          => 'text',
					'title'       => __( 'Text', '{{wp.textDomain}}' ),
					'description' => __( 'This is a text field.', '{{wp.textDomain}}' ),
					'type'        => 'text',
				]
			)
			->add_field(
				[
					'id'          => 'dashbaord2',
					'title'       => __( 'Dashboard Page', '{{wp.textDomain}}' ),
					'description' => __( 'This page will be used for dashboard', '{{wp.textDomain}}' ),
					'type'        => 'select',
					'options' => [
						'value1' => 'Label 1',
						'value2' => 'Label 2',
					],
				]
			);

		$tab->add_section(
			[
				'id'    => 'others',
				'title' => __( 'Others', '{{wp.textDomain}}' ),
			]
		)
			->add_field(
				[
					'id'          => 'text-2',
					'title'       => __( 'Other Text', '{{wp.textDomain}}' ),
					'description' => __( 'This is a text field.', '{{wp.textDomain}}' ),
					'type'        => 'text',
				]
			)
			->add_field(
				[
					'id'          => 'dashbaord',
					'title'       => __( 'Dashboard Page', '{{wp.textDomain}}' ),
					'description' => __( 'This page will be used for dashboard', '{{wp.textDomain}}' ),
					'type'        => 'select',
				]
			);

		$tab = $this->add_tab(
			[
				'id'    => 'advanced',
				'title' => __( 'Advanced', '{{wp.textDomain}}' ),
				'icon'  => 'dashicons dashicons-admin-generic',
			]
		);
	}
}
