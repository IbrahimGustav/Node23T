// print 1 - 10

for(let i=1;i<11;i++){
    console.log(`Looping : ${i}`);
    
}

//print 10, 20 ,30m 40 - 100
console.log("-----------------------------------------------");

for(let i=10;i<101;i+=10){
    console.log(`Looping : ${i}`);
    
}

console.log("---------------");
for(let i=100;i>=0;i-=10){
    console.log(`Looping : ${i}`);
    
}

//Print 1 -2
let sign = 1;
for(let k=1;k<=10;k++){
    console.log(k * sign);
    sign = sign * -1;
    
}
console.log("-----------------");

let check = 10
let factor = 0

for(let i=1; i <= check;i++){
    if(check % i == 0){
        factor++;
    }
}
if(factor==2){
    console.log(`${check} is a prime number`);
    
}
else{
    console.log(`${check} is not a prime number`);
    
}

//factorial number
let num = 5
let result = 1;
for (let i=1;i<=num;i++){
    result *=i;
}
console.log(`${num}! is ${result}`);
