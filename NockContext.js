var noun = require('./noun.js'),
    hamt = require('./hamt.js'),
    FormulaParser = require('./FormulaParser.js');

function NockContext(dashboard) {
    this.formulaCache = new hamt.Hamt();
    this.dashboard = dashboard;
}

NockContext.prototype.nock = function(subject, formula) {
    return formula.getCallTarget(this).bounce(subject);
};

NockContext.prototype.getFunctionCache = function(cell) {
    var pair = this.formulaCache.get(cell);

    if(!pair) {
        var f = FormulaParser.parse(cell);
        pair = { factory: f,
                 callTarget: f(this) };
        this.formulaCache.insert(cell, pair);
    }

    return new noun.FunctionCache(this, pair.factory, pair.callTarget);
};

module.exports = {
    NockContext: NockContext
}