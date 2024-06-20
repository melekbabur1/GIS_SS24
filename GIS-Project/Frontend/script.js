document.addEventListener('DOMContentLoaded', function() {
    const medikamentenTabelle = document.getElementById('medikamentenTabelle');

    function loadMedikamentenListe() {
        fetch('http://localhost:3000/api/medikamente')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Laden der Medikamentenliste');
                }
                return response.json();
            })
            .then(data => {
                renderMedikamentenListe(data);
            })
            .catch(error => console.error('Fehler beim Laden der Medikamentenliste:', error));
    }

    function renderMedikamentenListe(medikamentenListe) {
        medikamentenTabelle.innerHTML = '';
        medikamentenListe.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.medikament}</td>
                <td>${item.kaufdatum}</td>
                <td>${item.verfallsdatum}</td>
                <td><button class="delete-btn" data-id="${item.id}">x</button></td>
            `;
            medikamentenTabelle.appendChild(tr);
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteMedikament(id);
            });
        });
    }

    function deleteMedikament(id) {
        fetch(`http://localhost:3000/api/medikamente/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Löschen des Medikaments');
            }
            loadMedikamentenListe();
        })
        .catch(error => console.error('Fehler beim Löschen des Medikaments:', error));
    }

    loadMedikamentenListe();

    const form = document.getElementById('medikamentForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const medikament = document.getElementById('medikament').value;
            const kaufdatum = document.getElementById('kaufdatum').value;
            const verfallsdatum = document.getElementById('verfallsdatum').value;

            const newMedikament = { medikament, kaufdatum, verfallsdatum };

            fetch('http://localhost:3000/api/medikamente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMedikament),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Hinzufügen des Medikaments');
                }
                return response.json();
            })
            .then(data => {
                loadMedikamentenListe();
                form.reset();
            })
            .catch(error => console.error('Fehler beim Hinzufügen des Medikaments:', error));
        });
    }
});
