const http = require('http');
const port = 2000;

const data = [
    { name: 'Ardi', class: 'TI23T' },
    { name: 'Asep', class: 'TI23A' },
    { name: 'Bibi', class: 'TI23B' },
    { name: 'Budi', class: 'TI23C' },
    { name: 'Curut', class: 'TI23T' },
    { name: 'Dendeng', class: 'TI23E' },
    { name: 'Entog', class: 'TI23T' },
    { name: 'Fikri', class: 'TI23A' }
];

const server = http.createServer((req, res) => {
    const url = req.url;
    res.writeHead(200, { "Content-Type": "application/json" });

    if (url.startsWith('/student')) {
        const urlPath = url.split("/");
        const classParam = urlPath[2];
        const nameParam = urlPath[3];

        let dataFilter = data;

        if (classParam) {
            dataFilter = dataFilter.filter(student => student.class === classParam);
        }

        if (nameParam) {
            dataFilter = dataFilter.filter(student => student.name === nameParam);
        }

        if (dataFilter.length > 0) {
            res.write(JSON.stringify(dataFilter));
        } else {
            res.write(JSON.stringify({ message: "No matching students found" }));
        }
    } else {
        res.write(JSON.stringify({ message: "Invalid endpoint" }));
    }

    res.end();
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
