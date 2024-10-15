
let studentData = [
    {
        idnumber:1,
        name:"Annie",
        city:"Bandung",
        java : 50,
        python : 75,
        c:80
    },
    {
        idnumber:2,
        name:"Bull",
        city:"Bogor",
        java : 30,
        python : 55,
        c:100
    },
    {
        idnumber:3,
        name:"Chairil",
        city:"Palembang",
        java : 100,
        python : 75,
        c:75
    }
]

console.log(studentData[2]["name"]);
studentData.push(
    {idnumber:4,name:"Daddy",city:"Malang",java:20,python:50,C:100}
)

console.log(studentData);

let bjava = 0
let name = ""
for (let i = 0;i<studentData.length;i++){
    if(studentData[i]["java"] > bjava){
        bjava = studentData[i]["java"]
        name = studentData[i]["name"]
    }
    
} 
console.log(`Biggest java score is: ${name}`);

let score = 0
let scorefinal = 0
for (let i = 0;i<studentData.length;i++){
    score = studentData[i]["python"] + score
    scorefinal = score / studentData.length
}
console.log(`python score mean is ${scorefinal}`);

let over70 = studentData.filter(score=>score.java>70)
console.log(over70);

let nameover70 = over70.map(score => score.name)
console.log(nameover70);
