<?php
/**
 * EldeVar REST API Endpoints & Custom Post Types
 *
 * @package EldeVar
 */

if (!defined('ABSPATH')) {
    exit;
}

// Ortak REST API ve Veri Çakışmasını Önle (Tema ve Eklenti aynı anda yüklense bile çakışmaz)
if (defined('ELDEVAR_REST_API_CORE_LOADED')) {
    return;
}
define('ELDEVAR_REST_API_CORE_LOADED', true);

/**
 * Register Custom Post Types for EldeVar (Products, Wanted Items, Orders)
 */
if (!function_exists('eldevar_register_post_types')) {
function eldevar_register_post_types() {
    // 1. Ürünler Post Type
    register_post_type('eldevar_product', array(
        'labels' => array(
            'name'               => __('EldeVar İlanları', 'eldevar'),
            'singular_name'      => __('EldeVar İlanı', 'eldevar'),
            'add_new'            => __('Yeni İlan Ekle', 'eldevar'),
            'add_new_item'       => __('Yeni EldeVar İlanı Ekle', 'eldevar'),
            'edit_item'          => __('İlanı Düzenle', 'eldevar'),
            'all_items'          => __('Tüm İlanlar', 'eldevar'),
        ),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields', 'author'),
        'menu_icon'    => 'dashicons-tag',
    ));

    // 2. Arama İlanları (Wanted Items)
    register_post_type('eldevar_wanted', array(
        'labels' => array(
            'name'               => __('Aranıyor İlanları', 'eldevar'),
            'singular_name'      => __('Aranıyor İlanı', 'eldevar'),
            'add_new'            => __('Yeni Arama İlanı Ekle', 'eldevar'),
            'all_items'          => __('Tüm Arama İlanları', 'eldevar'),
        ),
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon'    => 'dashicons-search',
    ));

    // 3. Siparişler (Orders)
    register_post_type('eldevar_order', array(
        'labels' => array(
            'name'               => __('EldeVar Siparişleri', 'eldevar'),
            'singular_name'      => __('Sipariş', 'eldevar'),
            'all_items'          => __('Tüm Siparişler', 'eldevar'),
        ),
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => false,
        'supports'     => array('title', 'editor', 'custom-fields'),
        'menu_icon'    => 'dashicons-cart',
    ));
}
add_action('init', 'eldevar_register_post_types');
}

/**
 * Register REST API Endpoints
 */
function eldevar_register_rest_routes() {
    register_rest_route('eldevar/v1', '/products', array(
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'eldevar_api_get_products',
            'permission_callback' => '__return_true',
        ),
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'eldevar_api_create_product',
            'permission_callback' => '__return_true',
        ),
    ));

    register_rest_route('eldevar/v1', '/wanted', array(
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'eldevar_api_get_wanted',
            'permission_callback' => '__return_true',
        ),
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'eldevar_api_create_wanted',
            'permission_callback' => '__return_true',
        ),
    ));

    register_rest_route('eldevar/v1', '/orders', array(
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'eldevar_api_create_order',
            'permission_callback' => '__return_true',
        ),
    ));
}
add_action('rest_api_init', 'eldevar_register_rest_routes');

/**
 * REST: Get products
 */
function eldevar_api_get_products($request) {
    // 1. Önce WooCommerce ürünleri var mı bak
    if (class_exists('WooCommerce')) {
        $wc_products = wc_get_products(array(
            'status' => 'publish',
            'limit'  => 50,
        ));

        if (!empty($wc_products)) {
            $formatted = array();
            foreach ($wc_products as $wc_prod) {
                $img_url = wp_get_attachment_image_url($wc_prod->get_image_id(), 'full');
                $gallery_ids = $wc_prod->get_gallery_image_ids();
                $images = array();
                if ($img_url) $images[] = $img_url;
                foreach ($gallery_ids as $gid) {
                    $u = wp_get_attachment_image_url($gid, 'full');
                    if ($u) $images[] = $u;
                }
                if (empty($images)) {
                    $images[] = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000';
                }

                $formatted[] = array(
                    'id'            => 'wc-' . $wc_prod->get_id(),
                    'title'         => $wc_prod->get_name(),
                    'category'      => 'giyim',
                    'categoryLabel' => 'Giyim',
                    'price'         => floatval($wc_prod->get_price() ?: 0),
                    'originalPrice' => floatval($wc_prod->get_regular_price() ?: 0),
                    'condition'     => 'Çok İyi (Az Kullanılmış)',
                    'conditionType' => 'az_kullanilmis',
                    'brand'         => get_post_meta($wc_prod->get_id(), '_eldevar_brand', true) ?: 'Özel Koleksiyon',
                    'description'   => wp_strip_all_tags($wc_prod->get_description() ?: $wc_prod->get_short_description()),
                    'images'        => $images,
                    'seller'        => array(
                        'id'         => 'store-1',
                        'name'       => get_bloginfo('name'),
                        'email'      => get_bloginfo('admin_email'),
                        'avatar'     => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                        'rating'     => 4.9,
                        'salesCount' => 38,
                        'location'   => 'Kadıköy, İstanbul',
                    ),
                    'ecoSavings'    => array(
                        'co2Kg'       => 12.5,
                        'waterLiters' => 2400,
                    ),
                    'shippingFee'   => 0,
                    'views'         => 120,
                    'likes'         => 34,
                    'createdAt'     => 'Yeni',
                );
            }
            if (!empty($formatted)) {
                return rest_ensure_response($formatted);
            }
        }
    }

    // 2. eldevar_product özel postlarını kontrol et
    $query = new WP_Query(array(
        'post_type'      => 'eldevar_product',
        'post_status'    => 'publish',
        'posts_per_page' => 50,
    ));

    if ($query->have_posts()) {
        $products = array();
        while ($query->have_posts()) {
            $query->the_post();
            $id = get_the_ID();
            $meta_raw = get_post_meta($id, '_eldevar_data', true);
            if (!empty($meta_raw) && is_array($meta_raw)) {
                $products[] = $meta_raw;
            }
        }
        wp_reset_postdata();
        if (!empty($products)) {
            return rest_ensure_response($products);
        }
    }

    // Bulunamazsa boş liste dön
    return rest_ensure_response(array());
}

/**
 * REST: Create new product
 */
function eldevar_api_create_product($request) {
    $params = $request->get_json_params();
    if (empty($params['title'])) {
        return new WP_Error('missing_title', __('Ürün başlığı gereklidir.', 'eldevar'), array('status' => 400));
    }

    $post_id = wp_insert_post(array(
        'post_title'   => sanitize_text_field($params['title']),
        'post_content' => sanitize_textarea_field($params['description'] ?? ''),
        'post_type'    => 'eldevar_product',
        'post_status'  => 'publish',
    ));

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    update_post_meta($post_id, '_eldevar_data', $params);
    update_post_meta($post_id, '_eldevar_price', sanitize_text_field($params['price'] ?? 0));
    update_post_meta($post_id, '_eldevar_brand', sanitize_text_field($params['brand'] ?? ''));

    return rest_ensure_response(array('success' => true, 'post_id' => $post_id));
}

/**
 * REST: Get wanted items
 */
function eldevar_api_get_wanted($request) {
    $query = new WP_Query(array(
        'post_type'      => 'eldevar_wanted',
        'post_status'    => 'publish',
        'posts_per_page' => 50,
    ));

    $items = array();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $data = get_post_meta(get_the_ID(), '_eldevar_wanted_data', true);
            if (!empty($data) && is_array($data)) {
                $items[] = $data;
            }
        }
        wp_reset_postdata();
    }

    return rest_ensure_response($items);
}

/**
 * REST: Create wanted item
 */
function eldevar_api_create_wanted($request) {
    $params = $request->get_json_params();
    if (empty($params['title'])) {
        return new WP_Error('missing_title', __('Başlık gereklidir.', 'eldevar'), array('status' => 400));
    }

    $post_id = wp_insert_post(array(
        'post_title'   => sanitize_text_field($params['title']),
        'post_content' => sanitize_textarea_field($params['storyWhy'] ?? ''),
        'post_type'    => 'eldevar_wanted',
        'post_status'  => 'publish',
    ));

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    update_post_meta($post_id, '_eldevar_wanted_data', $params);
    return rest_ensure_response(array('success' => true, 'post_id' => $post_id));
}

/**
 * REST: Create order
 */
function eldevar_api_create_order($request) {
    $params = $request->get_json_params();
    $order_num = sanitize_text_field($params['orderNumber'] ?? ('EV-' . time()));

    $post_id = wp_insert_post(array(
        'post_title'   => 'Sipariş #' . $order_num,
        'post_content' => 'Müşteri: ' . ($params['customer']['fullName'] ?? 'Bilinmiyor'),
        'post_type'    => 'eldevar_order',
        'post_status'  => 'publish',
    ));

    if (!is_wp_error($post_id)) {
        update_post_meta($post_id, '_eldevar_order_data', $params);
        return rest_ensure_response(array('success' => true, 'order_id' => $post_id));
    }

    return new WP_Error('order_save_failed', __('Sipariş kaydedilemedi.', 'eldevar'), array('status' => 500));
}
