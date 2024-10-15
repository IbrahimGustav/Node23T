let person = {
    name : {
        firstname : "John",
        lastname : "Legend"
    },
    age : "21",
    address : "Cisaat",
    hobby : ["Basket Ball", "Football","Hiking"],
    infoPerson : function(){
        return (
            `Name: ${person.name.firstname}\nAge:${person.age}`
        )

    }
}

console.log(person.infoPerson());

console.log(person);

//Accessing Object - output will be "John"
console.log(`Name : ${person.name.lastname}`);
console.log(`Name : ${person["name"]["firstname"]}`);

//Add key and value
person["idnumber"] = "1";
console.log(person);

//change the value of object - name: legend
person["name"]["firstname"] = "legend";
console.log(person);
delete person["idnumber"];
console.log(person);
person["hobby"][1];

//accessing data object with iteration using for..in

for (let key in person){
    console.log(key);
    
}

for (let key in person){
    console.log(key);
    
}