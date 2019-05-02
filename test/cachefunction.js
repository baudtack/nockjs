var noun = require('../noun.js'),
    nounT = require('./noun.js'),
    NockContext = require('../NockContext.js').NockContext,
    test = require('tape'),
    n = noun.dwim;

test("cache function", function(t) {
    t.plan(6);
    var formula = n([1, 0]),
        context = new NockContext({});

    t.ok(!formula.hasCachedFunction(context), "no cache");
    nounT.equals(t, context.nock(noun.dwim(0), formula), n(0), "product");
    t.ok(formula.hasCachedFunction(context), "yes cache");

    var c2 = new NockContext({});

    t.ok(!formula.hasCachedFunction(c2), "no second cache");
    nounT.equals(t, c2.nock(noun.dwim(0), formula), n(0), "second product");
    t.ok(formula.hasCachedFunction(c2), "yes second cache");
});