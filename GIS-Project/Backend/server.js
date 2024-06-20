const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

// Array für die Medikamentenliste
let medikamentenListe = [];

const server = http.createServer((req, res) => {
    // CORS Header setzen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Routen behandeln basierend auf der URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    switch (pathname) {
        case '/':
            // Lese index.html und sende sie als Antwort
            fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Error loading index.html: ${err}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
            break;
        case '/medikamentenliste.html':
            // Lese mediakmententabelle.html und sende sie als Antwort
            fs.readFile(path.join(__dirname, 'mediakmententabelle.html'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Error loading mediakmententabelle.html: ${err}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
            break;
        case '/medikamenthinzufuegen.html':
            // Lese medikamenthinfuegen.html und sende sie als Antwort
            fs.readFile(path.join(__dirname, 'medikamenthinzufuegen.html'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Error loading medikamenthinzufuegen.html: ${err}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
            break;
        case '/script.js':
            // Lese script.js und sende es als Antwort
            fs.readFile(path.join(__dirname, 'script.js'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Error loading script.js: ${err}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.end(data);
                }
            });
            break;
        case '/style.css':
            // Lese style.css und sende es als Antwort
            fs.readFile(path.join(__dirname, 'style.css'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Error loading style.css: ${err}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.end(data);
                }
            });
            break;
        case '/api/medikamente':
            if (req.method === 'GET') {
                // Sende die Medikamentenliste als JSON zurück
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(medikamentenListe));
            } else if (req.method === 'POST') {
                // Verarbeite POST-Anfragen zum Hinzufügen eines neuen Medikaments
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString(); // Daten von der Anfrage lesen
                });
                req.on('end', () => {
                    const newMedikament = JSON.parse(body);
                    medikamentenListe.push(newMedikament);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Medikament hinzugefügt', medikament: newMedikament }));
                });
            } else {
                res.writeHead(405); // Methode nicht erlaubt
                res.end('Method not allowed');
            }
            break;
        default:
            // Wenn die angeforderte Route nicht gefunden wird
            res.writeHead(404);
            res.end('Page not found');
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server läuft unter http://${hostname}:${port}/`);
});
