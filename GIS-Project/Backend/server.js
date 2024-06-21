const http = require('http');
const { parse } = require('url');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const hostname = '127.0.0.1';
const port = 3000;

let db; 


async function openDatabase() {
    try {
        const dbFilePath = './myDatabase.db'; 
        db = await sqlite.open({
            filename: dbFilePath,
            driver: sqlite3.Database
        });
        console.log('SQLite-Datenbank erfolgreich geöffnet');
    } catch (error) {
        console.error('Fehler beim Öffnen der SQLite-Datenbank:', error.message);
    }
}


async function createTable() {
    try {
        await db.exec(`CREATE TABLE IF NOT EXISTS medikamente (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medikament TEXT NOT NULL,
            kaufdatum TEXT NOT NULL,
            verfallsdatum TEXT NOT NULL
        )`);
        console.log('Tabelle "medikamente" erfolgreich erstellt');
    } catch (error) {
        console.error('Fehler beim Erstellen der Tabelle:', error.message);
    }
}


const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');


    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }


    const { pathname, query } = parse(req.url, true);

  
    if (pathname === '/api/medikamente' && req.method === 'GET') {
        try {
            const rows = await db.all('SELECT * FROM medikamente');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            console.error('Fehler beim Abrufen der Medikamentenliste:', error.message);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }
  
    else if (pathname === '/api/medikamente' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const newMedikament = JSON.parse(body);
            try {
                const result = await db.run('INSERT INTO medikamente (medikament, kaufdatum, verfallsdatum) VALUES (?, ?, ?)',
                    [newMedikament.medikament, newMedikament.kaufdatum, newMedikament.verfallsdatum]);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Medikament hinzugefügt', id: result.lastID }));
            } catch (error) {
                console.error('Fehler beim Hinzufügen des Medikaments:', error.message);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    }
  
    else if (pathname.startsWith('/api/medikamente/') && req.method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        try {
            await db.run('DELETE FROM medikamente WHERE id = ?', id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Medikament gelöscht', id }));
        } catch (error) {
            console.error('Fehler beim Löschen des Medikaments:', error.message);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }

    else {
        res.writeHead(404);
        res.end('Page not found');
    }
});


async function startServer() {
    await openDatabase(); 
    await createTable(); 
    server.listen(port, hostname, () => {
        console.log(`Server läuft unter http://${hostname}:${port}/`);
    });
}

startServer(); 
