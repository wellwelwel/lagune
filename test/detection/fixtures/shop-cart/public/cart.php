<?php

declare(strict_types=1);

$cart = isset($_COOKIE['cart']) ? unserialize(base64_decode($_COOKIE['cart'])) : [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cart[] = (string) ($_POST['product'] ?? '');
    setcookie('cart', base64_encode(serialize($cart)), ['httponly' => true, 'samesite' => 'Lax']);
}

header('Content-Type: application/json');
echo json_encode(['items' => count($cart)]);
