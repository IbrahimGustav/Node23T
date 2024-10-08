let data = [10,20,30,40]

// Access Array
console.log(data[2]);

// Change array
data[2] = 100

console.log(data[2]);

//Add array element in the end of the array
data.push(80)
console.log(data);

//Add array element in the first element
data.unshift(69)
console.log(data);

//data.push("Budi")
//console.log(data);

//remove element in last
//data.pop()
//console.log(data);

//remove first element
data.shift()
console.log();

//Mean
let result = 0
for(let i=0;i<data.length;i++){
    result += data[i]
console.log(`${result/data.length}`);
}

let country = ["Indonesia", "India", "Japan", "South Sudan", "Sweden", "Jamaica"]
//Please group the country by the first letter
// ["Indonesia", "India"]
// ["Japan", "Jamaica"]
// ["South Sudan", "Sweden"]
let countryi = []
let countryj = []
let countrys = []

for(let i=0; i<country.length;i++){
    if(country[i][0]=="I"){
        countryi.push(country[i])
    }
    else if(country[i][0]=="J"){
        countryj.push(country[i])
    }
    else{
        countrys.push(country[i])
    }
    }
console.log(`${countryi}, ${countryj}, ${countrys}`);
