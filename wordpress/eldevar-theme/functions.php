<?php
/**
 * EldeVar Theme Functions & Asset Management
 *
 * @package EldeVar
 */

if (!defined('ABSPATH')) {
    exit;
}

// REST API ve Özel İçerik Türlerini Dahil Et
require_once get_template_directory() . '/inc/rest-api.php';

/**
 * Tema Kurulum Ayarları
 */
function eldevar_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'eldevar_theme_setup');

/**
 * Vite Tarafından Üretilen CSS ve JS Dosyalarını Dinamik Olarak Yükle
 */
function eldevar_enqueue_assets() {
    $theme_dir = get_template_directory();
    $theme_uri = get_template_directory_uri();
    $assets_dir = $theme_dir . '/assets';
    $assets_uri = $theme_uri . '/assets';

    // Stil Dosyası (style.css)
    wp_enqueue_style('eldevar-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));

    // Google Fonts
    wp_enqueue_style(
        'eldevar-google-fonts',
        'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap',
        array(),
        null
    );

    // Assets klasöründeki derlenmiş Vite CSS ve JS dosyalarını tara
    if (is_dir($assets_dir)) {
        $files = scandir($assets_dir);
        $main_js_handle = '';

        foreach ($files as $file) {
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            $full_path = $assets_dir . '/' . $file;
            $file_url = $assets_uri . '/' . $file;
            $version = filemtime($full_path);

            // CSS Dosyası
            if ($ext === 'css') {
                $handle = 'eldevar-' . sanitize_title(pathinfo($file, PATHINFO_FILENAME));
                wp_enqueue_style($handle, $file_url, array(), $version);
            }

            // JavaScript Dosyası (Vite Module)
            if ($ext === 'js') {
                $handle = 'eldevar-' . sanitize_title(pathinfo($file, PATHINFO_FILENAME));
                wp_enqueue_script($handle, $file_url, array(), $version, true);
                if (empty($main_js_handle)) {
                    $main_js_handle = $handle;
                }
            }
        }

        // React uygulamasına WordPress ortam ayarlarını aktar
        if (!empty($main_js_handle)) {
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

            $settings = array(
                'siteUrl'             => home_url('/'),
                'restUrl'             => esc_url_raw(rest_url()),
                'nonce'               => wp_create_nonce('wp_rest'),
                'ajaxUrl'             => admin_url('admin-ajax.php'),
                'siteTitle'           => get_bloginfo('name'),
                'siteDescription'     => get_bloginfo('description'),
                'themeUrl'            => $theme_uri,
                'currentUser'         => $user_data,
                'isWooCommerceActive' => class_exists('WooCommerce'),
            );

            wp_localize_script($main_js_handle, 'eldevarSettings', $settings);
        }
    }
}
add_action('wp_enqueue_scripts', 'eldevar_enqueue_assets');

/**
 * Vite JS script taglerine type="module" niteliği ekleme
 */
function eldevar_script_type_module($tag, $handle, $src) {
    if (strpos($handle, 'eldevar-') === 0 && strpos($src, '.js') !== false) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>' . "\n";
    }
    return $tag;
}
add_filter('script_loader_tag', 'eldevar_script_type_module', 10, 3);

/**
 * Tema Etkinleştirildiğinde Sayfa veya Menü Önerisi
 */
function eldevar_after_switch_theme() {
    // Kalıcı bağlantı yapısını post-name olarak güncelle (REST API'nin sorunsuz çalışması için)
    global $wp_rewrite;
    $wp_rewrite->set_permalink_structure('/%postname%/');
    flush_rewrite_rules();
}
add_action('after_switch_theme', 'eldevar_after_switch_theme');
