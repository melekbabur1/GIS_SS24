document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('medikamentForm'); 

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const medikament = document.getElementById('medikament').value;
            const kaufdatum = document.getElementById('kaufdatum').value;
            const verfallsdatum = document.getElementById('verfallsdatum').value;

            let medikamentenListe = JSON.parse(localStorage.getItem('medikamentenListe')) || [];
            medikamentenListe.push({ medikament, kaufdatum, verfallsdatum });
            localStorage.setItem('medikamentenListe', JSON.stringify(medikamentenListe));

            window.location.href = 'medikamentenliste.html';
        });
    }

    const medikamentenTabelle = document.getElementById('medikamentenTabelle');

    if (medikamentenTabelle) {
        const medikamentenListe = JSON.parse(localStorage.getItem('medikamentenListe')) || [];

        for (let index = 0; index < medikamentenListe.length; index++) {
            const item = medikamentenListe[index];
            const tr = document.createElement('tr'); 

            tr.innerHTML = `
                <td>${item.medikament}</td>
                <td>${item.kaufdatum}</td>
                <td>${item.verfallsdatum}</td>
                <td><button class="delete-btn" data-index="${index}">x</button></td>
            `;

            medikamentenTabelle.appendChild(tr); 
        }

        const deleteButtons = document.querySelectorAll('.delete-btn');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                medikamentenListe.splice(index, 1);
                localStorage.setItem('medikamentenListe', JSON.stringify(medikamentenListe));
                this.parentElement.parentElement.remove(); 
            });
        }
    }
});

