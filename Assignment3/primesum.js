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

function sumOfPrimesInRange(start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
        if (isPrime(i)) {
            sum += i;
        }
    }
    return sum;
}

// Input number
const start = parseInt(prompt('Enter the initial input: '), 10);
const end = parseInt(prompt('Enter the final input: '), 10);

// Calculate the sum of prime numbers in the given range
const result = sumOfPrimesInRange(start, end);

console.log(`The sum of prime numbers from ${start} to ${end} is ${result}.`);
