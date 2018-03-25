// This is a parameterizable tree walker for arbitrary javascript objects
// Only, just using it in the tests, so far. 

const log = console.log.bind (console)
module.exports = walk

const NUMBER = 'number'
  , STRING = 'string'
  , OBJECT = 'object'
  , FUNCTION = 'function'

function walk (obj, shape) {
  shape = arguments.length > 1 ? shape : defaultShape
  return new Walker (obj, shape)
}

walk.shape = defaultShape
walk.leaf = function (obj) { return new Leaf (obj) }

function Walker (obj, shape) {
  const stack = [ defaultShape ({'#root': obj}) ] // careful 
  const self = this

  this.done = false
  this.value
  this.next = next
  this[Symbol.iterator] = _ => self

  // where
  function next () {
    const head = stack [stack.length - 1]

    if (head.done) {
      if (stack.length > 1) {
        stack.pop ()
        const k = stack [stack.length - 1] .selection
        stack [stack.length - 1] .increment ()
        self.value = { tag:'end', type:head.type, key:k } //, head.node]
      }
      else 
        self.done = true
    }

    else {
      const child = shape (head.child, stack)
      if (child instanceof Leaf) {
        self.value = { tag:'leaf', type:child.type, key:head.selection, value:child.value }
        head.increment ()
      }
      else {
        self.value = { tag:'start', type:child.type, key:head.selection } //, child.node]
        stack.push (child)
      }
    }

    return self
  }
}

// 'Shapes' are basically lateral iterators,
// calling 'increment' moves their 'child selection' to the right by one. 

function defaultShape (obj) {
  return obj == null ? new Leaf (obj)
    : typeof obj === STRING ? new Leaf (obj)
    : Array.isArray (obj) ? new ArrayShape (obj)
    : typeof obj[Symbol.iterator] === 'function' ? new IteratorShape (obj)
    : typeof obj === OBJECT ? new ObjectShape (obj)
    : new Leaf (obj)
}

function Leaf (obj) {
  this.type = typeof obj
  this.value = obj
}

function IteratorShape (obj) {
  let index = -1
  obj = obj[Symbol.iterator]()
  this.type = 'iterator'

  this.increment = function () {
    let n = obj.next ()
    index += 1
    this.selection = index
    this.done = n.done
    this.child = n.value
    return this
  }

  this.increment ()
}

function ArrayShape (obj) {
  let index = -1
  this.type = 'array'
  this.increment = function () { 
    index += 1
    this.selection = index
    this.done = index >= obj.length
    this.child = !this.done ? obj[index] : null
    return this
  }
  this.increment ()
}

function ObjectShape (obj) {
  let index = -1
  const keys = Object.keys (obj)
  this.type = 'object'
  this.increment = function () { 
    index += 1
    this.selection = keys [index]
    this.done = index >= keys.length
    this.child = !this.done ? obj[keys[index]] : null
    return this
  }
  this.increment ()
}

