<?php
require 'vendor/autoload.php';
use Kreait\Firebase\Factory;

$firebase = (new Factory)->withServiceAccount(__DIR__.'/firebase_credentials.json');
$database = $firebase->createDatabase();

$data = json_decode(file_get_contents('php://input'), true);
if ($data) {
    $database->getReference('page-competences')->set($data);
    echo "État sauvegardé avec succès dans Firebase.";
} else {
    echo "Erreur : aucune donnée reçue.";
}
?>
