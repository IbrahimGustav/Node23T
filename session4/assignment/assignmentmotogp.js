let motoGP = [
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

let result = {};

motoGP.forEach(race => {
    let { firstName, lastName, country } = race.winner;
    let winLocation = `${race.circuit}, ${race.location}`;
    let fullName = `${firstName} ${lastName}`;
    
    if (!result[country]) {
        result[country] = {
            winningCircuits: [],
            totalWin: 0
        };
    }
    
    result[country].winningCircuits.push({ name: fullName, winLocation });
    result[country].totalWin += 1;
});


console.log(JSON.stringify(result, null, 2));
