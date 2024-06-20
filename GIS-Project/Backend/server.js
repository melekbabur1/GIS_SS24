const http = require('http');
const { parse } = require('url');
const { readFileSync, writeFileSync } = require('fs');
const sqlite3 = require('sqlite3').verbose();

const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer((req, res) => {
   
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
      
        db.all('SELECT * FROM medikamente', (err, rows) => {
            if (err) {
                console.error('Fehler beim Abrufen der Medikamentenliste:', err.message);
                res.writeHead(500);
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(rows));
            }
        });
    } else if (pathname === '/api/medikamente' && req.method === 'POST') {
    
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); 
        });
        req.on('end', () => {
            const newMedikament = JSON.parse(body);
            db.run('INSERT INTO medikamente (medikament, kaufdatum, verfallsdatum) VALUES (?, ?, ?)',
                [newMedikament.medikament, newMedikament.kaufdatum, newMedikament.verfallsdatum],
                function(err) {
                    if (err) {
                        console.error('Fehler beim Einfügen eines neuen Medikaments:', err.message);
                        res.writeHead(500);
                        res.end('Internal Server Error');
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Medikament hinzugefügt', id: this.lastID }));
                    }
                });
        });
    } else if (pathname.startsWith('/api/medikamente/') && req.method === 'DELETE') {
      
        const id = parseInt(pathname.split('/').pop(), 10);
        db.run('DELETE FROM medikamente WHERE id = ?', id, function(err) {
            if (err) {
                console.error('Fehler beim Löschen des Medikaments:', err.message);
                res.writeHead(500);
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Medikament gelöscht', id }));
            }
        });
    } else {
       
        res.writeHead(404);
        res.end('Page not found');
    }
});


server.listen(port, hostname, () => {
    console.log(`Server läuft unter http://${hostname}:${port}/`);
});
