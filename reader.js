const { exec } = require('./execute.js')
// process.stdin.resume();

let exp = ""
const tokenize = exp => {
  return exp.replace(/[\(\)\+\-\*\/]/g, " $& ")
            .trim()
            .replace(/(\s)+/g, " ")
            .split(' ')
}

const needMoreBrks = exp => {
  let braket = 0
  for (let i = 0; i < exp.length; i++) {
    if (exp[i] === '(') {
      braket++
    } else if (exp[i] === ')') {
      braket--
    }
    if (braket < 0) {
      throw new Error()
    }
  }
  return braket > 0
}

// process.stdin.on("data", chunk => {
//   exp += chunk
//   if (!needMoreBrks(exp)) {
//     console.log(exec(tokenize(exp)))
//     exp = ""
//   }
// })


// exp = "(define a 5)"
// console.log(exec(tokenize(exp)))
// exp = "(define (sqaure x) (* x x))"
// console.log(exec(tokenize(exp)))
// exp = "(sqaure a)"
// console.log(exec(tokenize(exp)))

exp = "(define x 10)"
console.log(exec(tokenize(exp)))
exp = "(if (> x 10) (set! x 5) (set! x 15))"
console.log(exec(tokenize(exp)))