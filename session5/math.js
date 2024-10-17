let {addNumber,subNumber,divNumber,mulNumber} = require('./arithmetic')
number1 = 50;
number2 = 100;

result = addNumber(number1,number2)
console.log(`${number1} + ${number2} = ${result}`);


result = subNumber(number1,number2)
console.log(`${number1} - ${number2} = ${result}`);


result = divNumber(number1,number2)
console.log(`${number1} / ${number2} = ${result}`);


result = mulNumber(number1,number2)
console.log(`${number1} * ${number2} = ${result}`);
