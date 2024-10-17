let {checkCondition} = require ('./weather')
let {landCondition} = require ('./land') 

const weatherData = {
    temperature:26,
    humidity:60,
    winSpeed:10
}
let result = checkCondition(weatherData)

const land = [
    ["fertile", "dry", "fertile", "fertile"],
    ["barren", "dry", "dry", "fertile"],
    ["fertile", "fertile", "fertile", "dry"],
    ["dry", "dry", "dry", "dry"]
]

let landresult = landCondition(land)
console.log(`Total fertile plot: ${landCondition(land)}`);
console.log(`Total plots to be planted: ${landCondition(land)}`);
console.log(checkCondition(weatherData));

