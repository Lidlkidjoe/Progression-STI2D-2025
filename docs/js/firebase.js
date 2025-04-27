import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = { 
  apiKey: "AIzaSyDATwNCN9VWgLz80ib0b99iBbjMt8-iduM",
  authDomain: "sauvegarde-donnees-9dd15.firebaseapp.com",
  databaseURL: "https://sauvegarde-donnees-9dd15-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "sauvegarde-donnees-9dd15",
  storageBucket: "sauvegarde-donnees-9dd15.appspot.com",
  messagingSenderId: "847875027342",
  appId: "1:847875027342:web:1af2f608ebd86184d234df"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const userId = "user1";

async function checkPassword(inputPassword) {
    try {
      const snapshot = await get(ref(db, 'admin/password'));
      if (snapshot.exists()) {
        const correctPassword = snapshot.val();
        // Comparaison simple (pour une vraie sécurité, il faudrait utiliser un hash)
        return inputPassword === correctPassword;
      }
      return false;
    } catch (error) {
      console.error("Erreur de vérification:", error);
      return false;
    }
  }

// Fonction pour normaliser les IDs (corrige le problème des caractères interdits)
function normalizeId(id) {
  return id.replace(/[.#$/[\]]/g, '_');
}

// Charger l'état des cases à cocher
async function loadState() {
  try {
    const snapshot = await get(ref(db, `states/${userId}`));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("Données chargées:", data);
      
      document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        const normalizedId = normalizeId(checkbox.id);
        if (normalizedId in data) {
          checkbox.checked = data[normalizedId];
          console.log("Case mise à jour:", normalizedId, data[normalizedId]);
        }
      });
    }
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    showStatus('⚠️ Erreur de chargement', true);
  }
}

// Sauvegarder l'état des cases à cocher
async function saveState() {
  const state = {};
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    state[normalizeId(checkbox.id)] = checkbox.checked;
  });

  try {
    await set(ref(db, `states/${userId}`), state);
    showStatus('✅ Sauvegardé !');
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    showStatus('⚠️ Échec de la sauvegarde', true);
  }
}

// Afficher les notifications
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
  
  setTimeout(() => { status.style.opacity = '1'; }, 10);
  setTimeout(() => {
    status.style.opacity = '0';
    setTimeout(() => status.remove(), 300);
  }, 3000);
}

let editMode = false; // Variable globale pour suivre l'état

// Fonction pour activer/désactiver les cases
function toggleCheckboxes(enable) {
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.disabled = !enable;
  });
}

// Configuration du bouton d'édition
function setupEditToggle() {
    const toggleBtn = document.getElementById('toggleEdit');
    if (!toggleBtn) return;
  
    toggleBtn.addEventListener('click', async () => {
      if (!editMode) {
        // Mode édition - demande du mot de passe
        const password = prompt("Entrez le mot de passe pour éditer:");
        
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

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Vérification que la page contient des checkboxes
  if (document.querySelector('input[type="checkbox"]')) {
    loadState();
    
    // Configuration des écouteurs
    const saveButton = document.getElementById('save');
    if (saveButton) {
      saveButton.addEventListener('click', saveState);
    }
    
  // 3. NOUVEAU : Gestion de l'édition (à ajouter APRÈS les écouteurs existants)
  setupEditToggle(); // Active le bouton toggleEdit
  toggleCheckboxes(false); // Désactive les cases par défaut

  // 4. Sauvegarde automatique (MODIFIÉE pour ne sauver QUE si editMode = true)
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (editMode) saveState(); // Sauvegarde uniquement en mode édition
    });
  });
    
    showStatus('Système prêt !');
  }
});