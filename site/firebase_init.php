<?php
require 'vendor/autoload.php'; // Inclure les dépendances via Composer

use Kreait\Firebase\Factory;

// Initialisation Firebase
$firebase = (new Factory)->withServiceAccount('path/to/firebase_credentials.json');
$database = $firebase->createDatabase();

// Exemple : sauvegarder une donnée
$data = ['message' => 'Bonjour Xavier'];
$database->getReference('test')->set($data);

echo "Données sauvegardées dans Firebase !";
?>
