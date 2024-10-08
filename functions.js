//traditionally function

function add2number(num1,num2){
    let result = num1 + num2
    return result
}
//Arrow Function

let divide2number = (num1,num2) => {
    let result = num1 / num2
    return result
}

console.log(add2number(10,50));
console.log(divide2number(50,10));
