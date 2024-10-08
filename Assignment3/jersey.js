const prompt = require('prompt-sync')();

function getPlayerPosition(jerseyNumber) {
    let positions = [];

    if (jerseyNumber % 2 === 0) {
        positions.push("target attacker");
        if (jerseyNumber >= 50 && jerseyNumber <= 100) {
            positions.push("have the right to be chosen as team captain");
        }
    } else {
        positions.push("defender");
        if (jerseyNumber > 90) {
            positions.push("Playmaker");
        }
        if (jerseyNumber % 3 === 0 && jerseyNumber % 5 === 0) {
            positions.push("keeper");
        }
    }

    return positions.length > 0 ? positions.join(', ') : "no specific position";
}

// Input the jersey number
const jerseyNumber = parseInt(prompt('Enter the jersey number: '), 10);

// Analyze the player's position status
const positions = getPlayerPosition(jerseyNumber);

console.log(`The player's position(s) for jersey number ${jerseyNumber} is/are: ${positions}.`);
