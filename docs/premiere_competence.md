<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
  import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDATwNCN9VWgLz80ib0b99iBbjMt8-iduM",
  authDomain: "sauvegarde-donnees-9dd15.firebaseapp.com",
  databaseURL: "https://sauvegarde-donnees-9dd15-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "sauvegarde-donnees-9dd15",
  storageBucket: "sauvegarde-donnees-9dd15.appspot.com",
  messagingSenderId: "847875027342",
  appId: "1:847875027342:web:1af2f608ebd86184d234df"
};

  // Initialiser Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const userId = "user1"; // tu peux rendre ça dynamique si tu veux plus tard

  // Charger l'état des cases à cocher
  async function loadState() {
    try {
      const snapshot = await get(ref(db, `states/${userId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
          const id = checkbox.id;
          if (data[id] !== undefined) {
            checkbox.checked = data[id];
          }
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des états :", error);
    }
  }

  // Sauvegarder l'état des cases à cocher
  async function saveState() {
    const state = {};
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      state[checkbox.id] = checkbox.checked;
    });

    try {
      await set(ref(db, `states/${userId}`), state);
      alert('État sauvegardé avec succès !');
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save').addEventListener('click', saveState);
    loadState();
  });
</script>

# Compétences de la progression de première

<table border="1">
  <thead>
    <tr>
      <th>Objectif formation</th>
      <th>Compétences</th>
      <th>Vu 1</th>
      <th>Vu 2</th>
      <th>Vu 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3"><strong>O1 - Caractériser des produits ou des constituants privilégiant un usage raisonné du point de vue développement durable.</strong></td>
      <td>CO1.1. Justifier les choix des structures matérielles et/ou logicielles d’un produit, identifier les flux mis en œuvre dans une approche de développement durable.</td>
      <td><input type="checkbox" id="o1-co1.1-vu1"></td>
      <td><input type="checkbox" id="o1-co1.1-vu2"></td>
      <td><input type="checkbox" id="o1-co1.1-vu3"></td>
    </tr>
    <tr>
      <td>CO1.2. Justifier le choix d’une solution selon des contraintes d’ergonomie et de design.</td>
      <td><input type="checkbox" id="o1-co1.2-vu1"></td>
      <td><input type="checkbox" id="o1-co1.2-vu2"></td>
      <td><input type="checkbox" id="o1-co1.2-vu3"></td>
    </tr>
    <tr>
      <td>CO1.3. Justifier les solutions constructives d’un produit au regard des performances environnementales et estimer leur impact sur l’efficacité globale.</td>
      <td><input type="checkbox" id="o1-co1.3-vu1"></td>
      <td><input type="checkbox" id="o1-co1.3-vu2"></td>
      <td><input type="checkbox" id="o1-co1.3-vu3"></td>
    </tr>
  </tbody>
</table>

<button id="save">Enregistrer</button>
