var nounT = require('./noun.js'),
    test = require('tape'),
    tchk = require('tape-check'),
    check = tchk.check,
    Hamt = require('../hamt.js').Hamt;

var g = nounT.genNoun,
    m = new Hamt();

test('maps work like maps', check({ times: 1000 }, g, g, g, function (t, k, v1, v2) {
  t.plan(2);
  m.insert(k, v1);
  nounT.equals(t, m.get(k), v1, "first insert");
  m.insert(k, v2);
  nounT.equals(t, m.get(k), v2, "second insert");
}));
