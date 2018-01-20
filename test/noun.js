var noun = require('../noun.js'),
    test = require('tape'),
    tchk = require('testcheck'),
    gen  = tchk.gen,
    BigInteger = require('jsbn').BigInteger;

function equals(t, got, expected, msg) {
  if ( got.equals(expected) ) {
    t.pass(msg);
    return true;
  }
  else {
    t.fail(msg);
    t.comment("got:      " + got.toString());
    t.comment("expected: " + expected.toString());
    return false;
  }
}

var genAtom = gen.array(gen.intWithin(0, 16)).then(function (digits) {
  for ( var i = 0; i < digits.length; ++i ) {
    digits[i] = digits[i].toString(16);
  }
  return new noun.Atom.Atom(new BigInteger(digits.join(''), 16));
});

function mkCellGen(g1) {
  return gen.array(g1, {size: 2}).then(function(a) {
    return new noun.Cell(a[0], a[1]);
  });
}

var genCell = gen.nested(mkCellGen, genAtom),
    genNoun = gen.oneOf([genAtom, genCell]);

module.exports = {
  genAtom: genAtom,
  genCell: genCell,
  genNoun: genNoun,
};

/*
const { check, gen } = require('tape-check')

test('maps work like maps', check(

test('addition is commutative', check(gen.int, gen.int, (t, numA, numB) => {
    t.plan(1)
    t.equal(numA + numB, numB + numA)
}));
*/

/*
function randomAtom() {
  var c, i, bytes = Math.floor(Math.random() * 4) + 1;
  var c = new BigInteger();
  var d = new BigInteger();
  c.fromInt(0);
  for ( i = 0; i < bytes; ++i ) {
    d.fromInt(Math.floor(Math.random() * 0xff));
    c = c.shiftLeft(8);
    c = c.xor(d);
  }
  return new noun.Atom.Atom(c);
}

function randomCell(depth) {
  return new noun.Cell(randomNoun(depth+1), randomNoun(depth+1));
}

function randomNoun(depth) {
  if ( depth > 10 || Math.random() > 0.5) {
    return randomAtom();
  }
  else {
    return randomCell(depth);
  }
}
*/

module.exports = {
  equals: equals,
  genAtom: genAtom,
  genCell: genCell,
  genNoun: genNoun,
};
