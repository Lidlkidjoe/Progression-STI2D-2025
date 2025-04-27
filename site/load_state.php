<?php
require 'vendor/autoload.php';
use Kreait\Firebase\Factory;

$firebase = (new Factory)->withServiceAccount(__DIR__.'/firebase_credentials.json');
$database = $firebase->createDatabase();

$data = $database->getReference('page-competences')->getValue();
header('Content-Type: application/json');
echo json_encode($data);
?>
