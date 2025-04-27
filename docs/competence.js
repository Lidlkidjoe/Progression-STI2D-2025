// Charger l'état depuis Firebase
fetch('/load_state.php')
  .then(response => response.json())
  .then(data => {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      const id = checkbox.id;
      if (data[id] !== undefined) {
        checkbox.checked = data[id];
      }
    });
  });

// Sauvegarder l'état dans Firebase
document.getElementById('save').addEventListener('click', () => {
  const state = {};
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    state[checkbox.id] = checkbox.checked;
  });

  fetch('/save_state.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  }).then(() => alert('État sauvegardé avec succès.'));
});
