const prompt = require('prompt-sync')();

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true;
}

function nextPrime(num) {
    let nextNum = num + 1;
    while (!isPrime(nextNum)) {
        nextNum++;
    }
    return nextNum;
}

// Input number
const input = parseInt(prompt('Enter a number: '), 10);

// Find the next prime number
const result = nextPrime(input);

console.log(`The next prime number after ${input} is ${result}.`);
