<script src="competence.js"></script>


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
    <!-- Ajoutez d'autres lignes ici pour les autres objectifs et compétences -->
  </tbody>
</table>

<button id="save">Enregistrer</button>

<script>
  // Charger l'état des cases à cocher depuis le serveur
  fetch('load_state.php')
    .then(response => response.json())
    .then(data => {
      document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        const id = checkbox.id;
        if (data[id] !== undefined) {
          checkbox.checked = data[id];
        }
      });
    });

  // Sauvegarder l'état des cases à cocher sur le serveur
  document.getElementById('save').addEventListener('click', () => {
    const state = {};
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      state[checkbox.id] = checkbox.checked;
    });

    fetch('save_state.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    })
      .then(response => response.text())
      .then(data => {
        alert('État sauvegardé sur le serveur !');
      });
  });
</script>