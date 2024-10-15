let student = {
    name : "Madun",
    age : 21,
    address : "Cisaat"
}

//accessing with iteration declarative

for(let key in student){
    console.log(`${key} : ${student[key]}`);
    }

//Destructuring
let {name,age,address} = student
console.log(`Name : ${name}`);
console.log(`Age : ${age}`);
console.log(`Address : ${address}`);

//print out with static method
console.log((Object.keys(student))); //["name","age","address"]

