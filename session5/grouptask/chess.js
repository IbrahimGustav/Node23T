let {chesschecker,checkKing} = require(`./board.js`)

const board = [
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "R", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "K", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*"]
];

chesschecker(board)
let result = checkKing()
console.log(result);
