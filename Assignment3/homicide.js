const prompt = require('prompt-sync')();

function investigateCase(criteria) {
    const { a, b, c, d, e, f, g } = criteria;
    let totalScore = 0;

    if (a) totalScore += 50;
    if (b) totalScore += 500;
    if (c) totalScore += 250;
    if (d) totalScore += 150;
    if (e) totalScore += 100;
    if (f) totalScore += 50;
    if (g) totalScore += 750;

    console.log(`Total score: ${totalScore}`);
    
    if (totalScore > 1300 && c && e) {
        console.log("It is certain that it is a murder.");
    } else {
        console.log("It is not confirmed as a murder.");
    }
}

// Investigation
const a = prompt('Was there cyanide powder in the victim\'s stomach? (yes/no) ') === 'yes';
const b = prompt('Was there > 50 milligrams of cyanide powder in the victim\'s stomach? (yes/no) ') === 'yes';
const c = prompt('Is there CCTV that clearly shows someone putting something into the glass? (yes/no) ') === 'yes';
const d = prompt('Is there CCTV that blurredly shows someone putting something into the glass? (yes/no) ') === 'yes';
const e = prompt('Are there two or more fingerprints on the glass? (yes/no) ') === 'yes';
const f = prompt('Are there suspicious movements? (yes/no) ') === 'yes';
const g = prompt('Was there cyanide powder in the perpetrator\'s pocket? (yes/no) ') === 'yes';

// Result
investigateCase({ a, b, c, d, e, f, g });
