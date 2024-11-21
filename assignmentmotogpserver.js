//Ibrahim Gustav Amany TI23T 20230040077

const http = require('http');
const port = 8000;

const motoGP = [
    {
        circuit: 'Losail',
        location: 'Qatar',
        winner: {
            firstName: 'Andrea',
            lastName: 'Dovizioso',
            country: 'Italy'
        }
    },
    {
        circuit: 'Autodromo',
        location: 'Argentina',
        winner: {
            firstName: 'Cal',
            lastName: 'Crutchlow',
            country: 'UK'
        }
    },
    {
        circuit: 'De Jerez',
        location: 'Spain',
        winner: {
            firstName: 'Valentino',
            lastName: 'Rossi',
            country: 'Italy'
        }
    },
    {
        circuit: 'Mugello',
        location: 'Italy',
        winner: {
            firstName: 'Andrea',
            lastName: 'Dovizioso',
            country: 'Italy'
        }
    }
];

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(motoGP, null, 2));
    } else if (req.url === '/country') {
        const groupedByCountry = motoGP.reduce((acc, race) => {
            const country = race.winner.country;
            if (!acc[country]) acc[country] = [];
            acc[country].push(race);
            return acc;
        }, {});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(groupedByCountry, null, 2));
    } else if (req.url === '/name') {
        const groupedByName = motoGP.reduce((acc, race) => {
            const name = `${race.winner.firstName} ${race.winner.lastName}`;
            if (!acc[name]) acc[name] = [];
            acc[name].push(race);
            return acc;
        }, {});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(groupedByName, null, 2));
    } else {
        // Handle Bad Request
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
