<?php
         // define function to get poll title
function getPollTitle($pollID)
{
    // get poll title from backend api endpoint /api/polls/{pollID}/title
    $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER["HTTP_HOST"] . "/api/simple/poll/$pollID/title";
    $title = file_get_contents($url);
    return $title;
}

$pollID = $_GET['pollID'];
$title = getPollTitle($pollID);

// echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER["HTTP_HOST"] . "/api/simple/poll/$pollID/title";


// set meta tags
echo '<meta name="og:title" content="' . $title . '">';
echo '<meta name="og:type" content="website">';
echo '<meta name="og:image" content="' . "https://" . $_SERVER["HTTP_HOST"] . '/expoll-32.png">';
echo '<meta name="og:url" content="' . "https://" . $_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"] .'">';
echo "<title>$title</title>";

$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";

echo "<script>window.location.href = '" . $actual_link . "/#/polls/" . $pollID . "?join=1';</script>";
?>