let studentsScore = [
    {
        name: 'Andi',
        score: 90
    },
    {
        name: 'Rudi',
        score: 80
    },
    {
        name: 'Dira',
        score: 100
    }
];

let topStudent = studentsScore[0];

for (let i = 1; i < studentsScore.length; i++) {
    if (studentsScore[i].score > topStudent.score) {
        topStudent = studentsScore[i];
    }
}

console.log(`The student with the highest score is ${topStudent.name} with a score of ${topStudent.score}.`);
