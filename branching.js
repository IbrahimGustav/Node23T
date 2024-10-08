/**
 * BRANCHING
 * check if a number is even or odd
 *  
 */

let number = 9;

if(number % 2 == 0){
    console.log(`${number} is even`);
}
else{
    console.log(`${number} is odd`);
    
}

/**
 * Age calculation
 */
const prompt = require('prompt-sync')()
let age = prompt("Insert your age");

if(age >= 18){
    console.log("The person is an adult");
}
else if(age >= 13){
    console.log("The person is a teenager");
}
else if(age >= 0){
    console.log("The person is a children");
    
}
else{
    console.log("The person is an adult");
    
}