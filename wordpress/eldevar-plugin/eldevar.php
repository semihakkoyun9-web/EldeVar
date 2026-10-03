<?php
/**
 * Plugin Name: EldeVar Marketplace Bridge
 * Plugin URI: https://eldevar.local
 * Description: EldeVar ikinci el pazaryerini herhangi bir WordPress sayfasına [eldevar] veya [eldevar_marketplace] kısa koduyla gömer.
 * Version: 1.1.0
 * Author: EldeVar Ekibi
 * Text Domain: eldevar
 */

if (!defined('ABSPATH')) {
    exit;
}

// REST API ve Özel İçerik Türleri
require_once plugin_dir_path(__FILE__) . 'inc/rest-api.php';

/**
 * Kısa kod: [eldevar] veya [eldevar_marketplace]
 */
function eldevar_plugin_shortcode($atts) {
    eldevar_plugin_enqueue_assets();
    return '<div id="root" class="eldevar-container w-full min-h-[600px]"></div>';
}
add_shortcode('eldevar', 'eldevar_plugin_shortcode');
add_shortcode('eldevar_marketplace', 'eldevar_plugin_shortcode');

/**
 * Eklenti varlıklarını yükle
 */
function eldevar_plugin_enqueue_assets() {
    $plugin_dir = plugin_dir_path(__FILE__);
    $plugin_uri = plugin_dir_url(__FILE__);
    $assets_dir = $plugin_dir . 'assets';
    $assets_uri = $plugin_uri . 'assets';

    wp_enqueue_style(
        'eldevar-plugin-fonts',
        'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap',
        array(),
        null
    );

    if (is_dir($assets_dir)) {
        $files = scandir($assets_dir);
        $main_js = '';

        foreach ($files as $file) {
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            $full_path = $assets_dir . '/' . $file;
            $file_url = $assets_uri . '/' . $file;
            $version = filemtime($full_path);

            if ($ext === 'css') {
                $handle = 'eldevar-p-' . sanitize_title(pathinfo($file, PATHINFO_FILENAME));
                wp_enqueue_style($handle, $file_url, array(), $version);
            }

            if ($ext === 'js') {
                $handle = 'eldevar-p-' . sanitize_title(pathinfo($file, PATHINFO_FILENAME));
                wp_enqueue_script($handle, $file_url, array(), $version, true);
                if (empty($main_js)) {
                    $main_js = $handle;
                }
            }
        }

        if (!empty($main_js)) {
            $current_user = wp_get_current_user();
            $user_data = null;
            if ($current_user && $current_user->ID > 0) {
                $user_data = array(
                    'id'         => $current_user->ID,
                    'name'       => $current_user->display_name ?: $current_user->user_login,
                    'email'      => $current_user->user_email,
                    'isLoggedIn' => true,
                    'avatar'     => get_avatar_url($current_user->ID),
                );
            }

            wp_localize_script($main_js, 'eldevarSettings', array(
                'siteUrl'             => home_url('/'),
                'restUrl'             => esc_url_raw(rest_url()),
                'nonce'               => wp_create_nonce('wp_rest'),
                'ajaxUrl'             => admin_url('admin-ajax.php'),
                'siteTitle'           => get_bloginfo('name'),
                'siteDescription'     => get_bloginfo('description'),
                'themeUrl'            => $plugin_uri,
                'currentUser'         => $user_data,
                'isWooCommerceActive' => class_exists('WooCommerce'),
            ));
        }
    }
}

/**
 * Script taglerine type="module" ekle
 */
function eldevar_plugin_script_type_module($tag, $handle, $src) {
    if (strpos($handle, 'eldevar-p-') === 0 && strpos($src, '.js') !== false) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>' . "\n";
    }
    return $tag;
}
add_filter('script_loader_tag', 'eldevar_plugin_script_type_module', 10, 3);
