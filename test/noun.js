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

var genSmall = gen.posInt.then(noun.Atom.fromInt),
    genBig = gen.array(gen.intWithin(0, 16), { minSize: 10 }).then(function (digits) {
      for ( var i = 0; i < digits.length; ++i ) {
        digits[i] = digits[i].toString(16);
      }
      return new noun.Atom.Atom(new BigInteger(digits.join(''), 16));
    }),
    genAtom = gen.oneOf([genSmall, genBig]);

function mkCellGen(g1) {
  return gen.array(g1, {size: 2}).then(function(a) {
    return new noun.Cell(a[0], a[1]);
  });
}

var genCell = gen.nested(mkCellGen, genAtom),
    genNoun = gen.oneOf([genAtom, genCell]);

module.exports = {
  equals: equals,
  genAtom: genAtom,
  genCell: genCell,
  genNoun: genNoun,
};
