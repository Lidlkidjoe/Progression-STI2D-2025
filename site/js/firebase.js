import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithPopup, GithubAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

console.log("firebase.js chargé !");

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDATwNCN9VWgLz80ib0b99iBbjMt8-iduM",
  authDomain: "sauvegarde-donnees-9dd15.firebaseapp.com",
  databaseURL: "https://sauvegarde-donnees-9dd15-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "sauvegarde-donnees-9dd15",
  storageBucket: "sauvegarde-donnees-9dd15.appspot.com",
  messagingSenderId: "847875027342",
  appId: "1:847875027342:web:1af2f608ebd86184d234df"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Surveiller l'état de connexion
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("protectedContent").style.display = "block";
  } else {
    document.getElementById("protectedContent").style.display = "none";
  }
});

// Initialisation du fournisseur GitHub
const provider = new GithubAuthProvider();

export function loginWithGitHub() {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Utilisateur connecté :", user);
      // Afficher le contenu protégé
      document.getElementById("protectedContent").style.display = "block";
    })
    .catch((error) => {
      console.error("Erreur lors de la connexion :", error);
    });
}

// Fonction pour gérer la déconnexion
export function logout() {
  signOut(auth)
    .then(() => {
      console.log("Utilisateur déconnecté.");
      document.getElementById("protectedContent").style.display = "none"; // Masque le contenu protégé
      document.getElementById("logoutButton").style.display = "none"; // Masque le bouton de déconnexion
      showStatus("Déconnexion réussie !");
    })
    .catch((error) => {
      console.error("Erreur lors de la déconnexion :", error);
      showStatus("Erreur lors de la déconnexion", true);
    });
}

// Ajout d'un écouteur au bouton de déconnexion
document.getElementById("logoutButton").addEventListener("click", logout);

// Surveiller l'état de connexion
onAuthStateChanged(auth, (user) => {
  const protectedContent = document.getElementById("protectedContent");
  const logoutButton = document.getElementById("logoutButton");

  if (!protectedContent || !logoutButton) {
    console.error("Éléments protégés introuvables dans le DOM.");
    return;
  }

  if (user) {
    console.log("Utilisateur connecté :", user);
    protectedContent.style.display = "block";
    logoutButton.style.display = "inline-block";
  } else {
    console.log("Aucun utilisateur connecté.");
    protectedContent.style.display = "none";
    logoutButton.style.display = "none";
  }
});

// Variable pour suivre l'état du mode édition
let editMode = false;

// Fonction pour vérifier le mot de passe
async function checkPassword(inputPassword) {
  try {
    const snapshot = await get(ref(db, 'states/admin/password'));
    if (snapshot.exists()) {
      const correctPassword = snapshot.val();
      return inputPassword === correctPassword; // Comparaison simple
    }
    return false;
  } catch (error) {
    console.error("Erreur de vérification du mot de passe :", error);
    return false;
  }
}

// Fonction pour activer/désactiver les cases à cocher
function toggleCheckboxes(enable) {
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.disabled = !enable;
  });
}

// Fonction pour afficher des messages de statut
function showStatus(message, isError = false) {
  const status = document.createElement('div');
  status.textContent = message;
  status.style.position = 'fixed';
  status.style.bottom = '20px';
  status.style.right = '20px';
  status.style.padding = '15px 25px';
  status.style.borderRadius = '8px';
  status.style.zIndex = '9999';
  status.style.fontFamily = 'Arial, sans-serif';
  status.style.fontSize = '16px';
  status.style.fontWeight = 'bold';
  status.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  status.style.color = 'white';
  status.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
  status.style.border = isError ? '2px solid #cc0000' : '2px solid #45a049';
  status.style.opacity = '0';
  status.style.transition = 'opacity 0.3s';

  document.body.appendChild(status);

  setTimeout(() => {
    status.style.opacity = '1';
  }, 10);
  setTimeout(() => {
    status.style.opacity = '0';
    setTimeout(() => status.remove(), 300);
  }, 3000);
}

// Configuration du bouton d'édition
function setupEditToggle() {
  const toggleBtn = document.getElementById('toggleEdit');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', async () => {
    if (!editMode) {
      // Mode édition - demande du mot de passe
      const password = prompt("Entrez le mot de passe pour éditer :");
      if (password && await checkPassword(password)) {
        editMode = true;
        toggleCheckboxes(editMode);
        toggleBtn.textContent = "🔒 Bloquer l'édition";
        showStatus("Mode édition activé");
      } else {
        showStatus("⚠️ Mot de passe incorrect", true);
      }
    } else {
      // Désactivation de l'édition
      editMode = false;
      toggleCheckboxes(editMode);
      toggleBtn.textContent = "✏️ Autoriser l'édition";
      showStatus("Mode édition désactivé");
    }
  });
}

function saveStateToFirebase() {
  const state = {};
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    state[checkbox.id] = checkbox.checked;
  });

  const userId = auth.currentUser.uid; // Remplacez par un identifiant utilisateur si nécessaire
  const stateRef = ref(db, `states/${userId}`);
  set(stateRef, state)
    .then(() => {
      showStatus("État sauvegardé dans Firebase !");
    })
    .catch(error => {
      console.error("Erreur lors de la sauvegarde dans Firebase :", error);
      showStatus("Erreur lors de la sauvegarde", true);
    });
}

function loadStateFromFirebase() {

  if (!auth.currentUser) {
    console.error("Aucun utilisateur connecté. Impossible de charger l'état.");
    showStatus("Veuillez vous connecter pour charger l'état.", true);
    return;
  }


  const userId = auth.currentUser.uid; // Remplacez par un identifiant utilisateur si nécessaire
  const stateRef = ref(db, `states/${userId}`);
  get(stateRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const state = snapshot.val();
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
          if (state[checkbox.id] !== undefined) {
            checkbox.checked = state[checkbox.id];
          }
        });
        showStatus("État chargé depuis Firebase !");
      } else {
        showStatus("Aucun état trouvé dans Firebase.");
      }
    })
    .catch(error => {
      console.error("Erreur lors du chargement depuis Firebase :", error);
      showStatus("Erreur lors du chargement", true);
    });
}

function setupCheckboxListeners() {
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', saveStateToFirebase);
  });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  setupEditToggle();
  toggleCheckboxes(false); // Désactive les cases par défaut
  loadStateFromFirebase(); // Charge l'état depuis Firebase
  setupCheckboxListeners(); // Configure les écouteurs pour sauvegarder automatiquement
  showStatus('Système prêt !');

  // Vérification de l'état de connexion
  onAuthStateChanged(auth, (user) => {
    const protectedContent = document.getElementById("protectedContent");
    if (!protectedContent) {
      console.error("L'élément #protectedContent est introuvable dans le DOM.");
      return;
    }

    if (user) {
      console.log("Utilisateur connecté :", user);
      protectedContent.style.display = "block"; // Affiche le contenu protégé
    } else {
      console.log("Aucun utilisateur connecté.");
      protectedContent.style.display = "none"; // Masque le contenu protégé
    }
  });
});

// Rendre la fonction accessible globalement
window.loginWithGitHub = loginWithGitHub;