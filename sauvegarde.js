// Importer les modules nécessaires
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDATwNCN9VWgLz80ib0b99iBbjMt8-iduM",
  authDomain: "sauvegarde-donnees-9dd15.firebaseapp.com",
  databaseURL: "https://sauvegarde-donnees-9dd15-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "sauvegarde-donnees-9dd15",
  storageBucket: "sauvegarde-donnees-9dd15.firebasestorage.app",
  messagingSenderId: "847875027342",
  appId: "1:847875027342:web:1af2f608ebd86184d234df"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Chemin vers le fichier HTML compétence.md
const cheminFichier = './docs/premiere_competence.md';

// Lire le fichier HTML et sauvegarder son contenu dans Firebase
fs.readFile(cheminFichier, 'utf-8', (err, data) => {
  if (err) {
    console.error("Erreur lors de la lecture du fichier :", err);
    return;
  }

  // Sauvegarder le contenu dans Firebase
  sauvegarderContenuPage(data);
});

// Fonction pour sauvegarder les données dans Firebase
function sauvegarderContenuPage(contenu) {
  set(ref(db, 'page-competences/'), { contenuHTML: contenu })
    .then(() => {
      console.log("Page Compétences sauvegardée avec succès !");
    })
    .catch((error) => {
      console.error("Erreur lors de la sauvegarde :", error);
    });
// Fonction pour lire les données depuis Firebase
function lireCompetences() {
    const pageRef = ref(db, 'page-competences/');
  
    get(pageRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Données récupérées :", snapshot.val());
        } else {
          console.log("Aucune donnée disponible.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la lecture des données :", error);
      });
  }
  
  // Appeler la fonction
  lireCompetences();
}
