const prompt = require('prompt-sync')();

function analyzePerson(name, age, place_to_live, savings) {
    let rank = '';

    if (age > 40 && (place_to_live === 'Nevada' || place_to_live === 'New York' || place_to_live === 'Havana') && savings > 10000000) {
        rank = 'Don';
    } else if (age >= 25 && age <= 40 && (place_to_live === 'New Jersey' || place_to_live === 'Manhattan' || place_to_live === 'Nevada') && savings >= 1000000 && savings <= 2000000) {
        rank = 'Underboss';
    } else if (age >= 18 && age <= 24 && (place_to_live === 'California' || place_to_live === 'Detroit' || place_to_live === 'Boston') && savings < 1000000) {
        rank = 'Capo';
    } else {
        rank = 'not suspicious';
    }

    if (rank === 'not suspicious') {
        console.log(`${name} is not suspicious.`);
    } else {
        console.log(`${name} is likely a mafia member with rank ${rank}.`);
    }
}

// Get user input to analyze
const name = prompt('Enter name: ');
const age = parseInt(prompt('Enter age: '), 10);
const place_to_live = prompt('Enter place to live: ');
const savings = parseFloat(prompt('Enter savings in dollars: '));

// Analyze the person
analyzePerson(name, age, place_to_live, savings);
