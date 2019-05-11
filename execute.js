class Enviroment {
  constructor(parent) {
    this.symbol = {}
    this.parent = parent
  }
}

const globalEnv = new Enviroment()

class Fn {
  constructor(params, body, env) {
    this.params = params
    this.body = body
    this.env = env
  }
  exec(real) {
    const env = new Enviroment(this.env)
    for (let i = 0; i < this.params.length; i++) {
      env.symbol[this.params[i]] = real[i]
    }
    let res = null
    this.body.forEach(code => res = getValue(code, env))
    return res
  }
}

const isNumber = exp => {
  if (parseFloat(exp) === Number(exp)) {
    return Number(exp)
  } else {
    return null
  }
}

const isSymbol = (exp, env) => {
  while (env) {
    if (env.symbol[exp] !== undefined) {
      return env.symbol[exp]
    } else {
      env = env.parent
    }
  }
  return null
}
const isNested = exp => {
  return exp[0] === '(' && exp[exp.length - 1] === ')'
}

const isPrimitiveOp = exp => {
  return ['+', '-', '*', '/'].findIndex(op => exp === op) > -1
}

const baseReduce = (acculator, init) => {
  return init === undefined ? arr => arr.reduce(acculator) :
    arr => arr.reduce(acculator, init)
}

const primitiveReduce = {
  '+': baseReduce((a, b) => a + b, 0),
  '-': baseReduce((a, b) => a - b),
  '*': baseReduce((a, b) => a * b, 1),
  '/': baseReduce((a, b) => a / b),
}

const getPrimitiveExpValue = (exp, env) => {
  const reduce = primitiveReduce[exp[0]];
  const params = getParams(exp.slice(1)).map(param => getValue(param, env))
  if (params.length) {
    return reduce(params)
  } else {
    return reduce
  }
}

const getParams = exp => {
  const params = []
  for (let i = 0; i < exp.length; i++) {
    if (exp[i] === '(') {
      let start = i, left = 0
      while (i < exp.length) {
        if (exp[i] === ')') {
          left--
          if (left === 0) {
            break
          }
        } else if (exp[i] === '(') {
          left++
        }
        i++
      }
      params.push(exp.slice(start, i + 1))
    } else {
      params.push(exp[i])
    }
  }
  return params
}

const isDefine = exp => exp === 'define'

const defineSth = (exp, env) => {
  if (exp[1] === '(') {
    return defineFunction(exp, env)
  } else {
    return defineVariable(exp, env)
  }
}

const defineFunction = (exp, env) => {
  let [header, ...body] = getParams(exp.slice(1))
  header = header.slice(1, header.length - 1)
  let name = header[0], params = header.slice(1)
  env.symbol[name] = new Fn(params, body, env)
  return env.symbol[name]
}

const defineVariable = (exp, env) => {
  const [key, value] = getParams(exp.slice(1))
  env.symbol[key] = getValue(value, env)
  return env.symbol[key]
}

const isFunction = (exp, env) => {
  while (env) {
    if (env.symbol[exp] instanceof Fn) {
      return true
    } else {
      env = env.parent
    }
  }
  return false
}

const execFn = (exp, env) => {
  const [name, ...params] = exp
  const fn = env.symbol[name]
  return fn.exec(params.map(param => getValue(param, env)))
}

const isAssignment = exp => exp === 'set!'

const assignValue = (exp, env) => {
  const [key, value] = getParams(exp.slice(1))
  const execEnv = env
  while (env) {
    if (env.symbol[key] !== undefined) {
      return env.symbol[key] = getValue(value, execEnv)
    } else {
      env = env.parent
    }
  }
  throw new Error("not defined")
}

const isLambda = exp => exp === "lambda"

const LambdaFn = (exp, env) => {
  let [params, ...body] = getParams(exp.slice(1))
  params = params.slice(1, header.length - 1)
  return new Fn(params, body, env)
}

const isIf = exp => exp === "if"

const makeIf = (exp, env) => {
  const [judge, truePath, falsePath] = getParams(exp.slice(1))
  const judgement = getValue(judge)
  if (judgement) {
    return getValue(truePath, env)
  } else {
    return getValue(falsePath, env)
  }
}

const isComparation = exp => ['>', '<', '=', '>=', '<='].findIndex(ch => ch === exp) > -1

const compareOp = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '=': (a, b) => a === b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
}

const compare = (exp, env) => {
  const [a, b] = getParams(exp.slice(1))
  return compareOp[exp[0]](getValue(a, env), getValue(b, env))
}

const getValue = (exp, env) => {
  env = env || globalEnv
  if (isNumber(exp) !== null) {
    return isNumber(exp)
  } else if (isFunction(exp[0], env)) {
    return execFn(exp, env)
  } else if (isSymbol(exp, env) !== null) {
    return isSymbol(exp, env)
  } else if (isNested(exp)) {
    return getValue(exp.slice(1, exp.length - 1), env)
  } else if (isPrimitiveOp(exp[0])) {
    return getPrimitiveExpValue(exp, env)
  } else if (isDefine(exp[0])) {
    return defineSth(exp, env)
  } else if (isAssignment(exp[0])) {
    return assignValue(exp, env)
  } else if (isLambda(exp[0])) {
    return LambdaFn(exp, env)
  } else if (isIf(exp[0])) {
    return makeIf(exp, env)
  } else if (isComparation(exp[0])) {
    return compare(exp, env)
  }
  return "Unknown expression."
}

module.exports = {
  exec: getValue
}