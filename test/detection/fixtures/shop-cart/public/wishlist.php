<?php

declare(strict_types=1);

$wishlist = [];

if (isset($_COOKIE['wishlist'])) {
    $decoded = json_decode($_COOKIE['wishlist'], true, 4);
    $wishlist = is_array($decoded) ? array_values(array_filter($decoded, 'is_string')) : [];
}

header('Content-Type: text/html; charset=utf-8');

foreach ($wishlist as $item) {
    echo '<li>' . htmlspecialchars($item, ENT_QUOTES, 'UTF-8') . '</li>';
}
