<?php

// get deletion id from request
if (isset($_GET['id'])) {
    $deleteID = $_GET['id'];
    // send backend request to delete user
    $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER["HTTP_HOST"] . "/api/user/delete/$deleteID";
    header("Location: " . $url);
} else {
    echo "Missing id parameter";
}
